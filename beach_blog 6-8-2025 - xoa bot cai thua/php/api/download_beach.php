<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

require_once("./../db/connect.php");

try {
    $conn = connect();

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        http_response_code(400);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Invalid beach id";
        exit;
    }

    // Beach core info
    $sql = "SELECT b.*, r.name AS region_name, r.city, r.national
            FROM beaches b
            LEFT JOIN regions r ON b.region_id = r.id
            WHERE b.id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$id]);
    $beach = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$beach) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Beach not found";
        exit;
    }

    // Galleries for this beach
    $galleriesSql = "SELECT id, image_url, caption FROM galleries WHERE beach_id = ? ORDER BY id ASC";
    $galleriesStmt = $conn->prepare($galleriesSql);
    $galleriesStmt->execute([$id]);
    $galleries = $galleriesStmt->fetchAll(PDO::FETCH_ASSOC);

    // Latest approved feedbacks
    $feedbackSql = "SELECT visitor_name, rating, feedback_comment, created_at, attachment_path
                    FROM beach_feedback
                    WHERE beach_id = ? AND is_approved = 1
                    ORDER BY created_at DESC
                    LIMIT 20";
    $feedbackStmt = $conn->prepare($feedbackSql);
    $feedbackStmt->execute([$id]);
    $feedbacks = $feedbackStmt->fetchAll(PDO::FETCH_ASSOC);

    // Helper to strip HTML
    $strip = function($text) {
        if ($text === null) return '';
        return trim(preg_replace('/\s+/', ' ', strip_tags($text)));
    };

    $lines = [];
    $lines[] = 'BEACH INFORMATION';
    $lines[] = '===================';
    $lines[] = '';
    $lines[] = 'Name: ' . ($beach['name'] ?? '');
    $lines[] = 'Region: ' . (($beach['region_name'] ?? '') ?: 'N/A');
    $lines[] = 'City: ' . (($beach['city'] ?? '') ?: 'N/A');
    $lines[] = 'Country: ' . (($beach['national'] ?? '') ?: 'N/A');
    $lines[] = 'Image URL: ' . (($beach['image_url'] ?? '') ?: 'N/A');
    $lines[] = '';
    $lines[] = 'DESCRIPTION';
    $lines[] = '-----------';
    $lines[] = $strip($beach['description'] ?? '');
    $lines[] = '';
    $lines[] = 'TRAVEL TIPS';
    $lines[] = '-----------';
    $lines[] = $strip($beach['tips'] ?? '');
    $lines[] = '';

    $lines[] = 'GALLERIES (' . count($galleries) . ')';
    $lines[] = '----------';
    if (count($galleries) === 0) {
        $lines[] = 'No gallery images available.';
    } else {
        foreach ($galleries as $index => $g) {
            $caption = $strip($g['caption'] ?? '');
            $lines[] = sprintf('%02d. %s%s', $index + 1, $g['image_url'], $caption ? ' — ' . $caption : '');
        }
    }
    $lines[] = '';

    $lines[] = 'LATEST APPROVED FEEDBACKS (' . count($feedbacks) . ')';
    $lines[] = '---------------------------';
    if (count($feedbacks) === 0) {
        $lines[] = 'No approved feedback yet.';
    } else {
        foreach ($feedbacks as $f) {
            $date = date('Y-m-d H:i', strtotime($f['created_at']));
            $lines[] = '- ' . ($f['visitor_name'] ?? 'Anonymous') . ' — Rating: ' . intval($f['rating']) . '/5 — ' . $date;
            $lines[] = '  ' . $strip($f['feedback_comment'] ?? '');
            if (!empty($f['attachment_path'])) {
                $lines[] = '  Attachment: ' . $f['attachment_path'];
            }
        }
    }
    $lines[] = '';
    $lines[] = 'Generated at: ' . date('Y-m-d H:i');
    $lines[] = 'Source: Beauty of Beaches';

    $content = implode("\r\n", $lines);

    $filename = preg_replace('/[^a-zA-Z0-9_-]+/', '_', ($beach['name'] ?? 'beach')) . '_info.txt';
    header('Content-Type: text/plain; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: no-store');
    echo $content;
    exit;

} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Error: ' . $e->getMessage();
}

?>


