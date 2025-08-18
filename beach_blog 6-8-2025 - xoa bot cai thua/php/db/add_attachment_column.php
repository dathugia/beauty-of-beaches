<?php
require_once __DIR__ . '/connect.php';

try {
	$conn = connect();

	// Kiểm tra cột đã tồn tại chưa
	$check = $conn->prepare("SHOW COLUMNS FROM beach_feedback LIKE 'attachment_path'");
	$check->execute();

	if ($check->rowCount() === 0) {
		// Thêm cột
		$conn->exec("ALTER TABLE beach_feedback ADD COLUMN attachment_path VARCHAR(255) NULL COMMENT 'Duong dan file dinh kem'");
		// Tạo index
		$conn->exec("CREATE INDEX idx_attachment_path ON beach_feedback(attachment_path)");
		echo "Added column attachment_path and index successfully.\n";
	} else {
		echo "Column attachment_path already exists.\n";
	}
} catch (Exception $e) {
	echo "Error: " . $e->getMessage() . "\n";
}
?>
