<?php
// Прост endpoint за изпращане на запитвания от формата към service@djvasconi.bg
// Работи на SuperHosting (PHP mail()). Качва се в public_html/send.php

header('Content-Type: application/json; charset=utf-8');

// CORS (същия домейн — не е строго нужно, но е безопасно)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) $data = $_POST;

// Honeypot против ботове
if (!empty($data['company'])) {
  echo json_encode(['ok' => true]);
  exit;
}

function clean($v, $max = 500) {
  $v = is_string($v) ? trim($v) : '';
  $v = str_replace(["\r", "\n"], ' ', $v);
  return mb_substr($v, 0, $max);
}
function cleanMultiline($v, $max = 2000) {
  $v = is_string($v) ? trim($v) : '';
  return mb_substr($v, 0, $max);
}

$name      = clean($data['name'] ?? '', 80);
$email     = clean($data['email'] ?? '', 120);
$phone     = clean($data['phone'] ?? '', 30);
$eventType = clean($data['eventType'] ?? '', 60);
$date      = clean($data['date'] ?? '', 30);
$location  = clean($data['location'] ?? '', 120);
$guests    = clean($data['guests'] ?? '', 30);
$budget    = clean($data['budget'] ?? '', 40);
$message   = cleanMultiline($data['message'] ?? '', 2000);

$errors = [];
if (mb_strlen($name) < 2) $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (mb_strlen($phone) < 6) $errors[] = 'phone';
if ($eventType === '') $errors[] = 'eventType';
if ($date === '') $errors[] = 'date';
if (mb_strlen($location) < 2) $errors[] = 'location';
if ($guests === '') $errors[] = 'guests';
if ($budget === '') $errors[] = 'budget';

if ($errors) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'validation', 'fields' => $errors]);
  exit;
}

$to      = 'service@djvasconi.bg';
$subject = '=?UTF-8?B?' . base64_encode('Ново запитване от сайта — ' . $name) . '?=';

$bodyLines = [
  'Ново запитване от djvasconi.bg',
  str_repeat('-', 40),
  'Име:       ' . $name,
  'Имейл:     ' . $email,
  'Телефон:   ' . $phone,
  'Събитие:   ' . $eventType,
  'Дата:      ' . $date,
  'Локация:   ' . $location,
  'Гости:     ' . $guests,
  'Бюджет:    ' . $budget,
  '',
  'Съобщение:',
  $message !== '' ? $message : '(без съобщение)',
  '',
  str_repeat('-', 40),
  'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '-'),
  'UA: ' . ($_SERVER['HTTP_USER_AGENT'] ?? '-'),
];
$body = implode("\r\n", $bodyLines);

$fromDomain = $_SERVER['HTTP_HOST'] ?? 'djvasconi.bg';
$fromAddr   = 'no-reply@' . preg_replace('/^www\./', '', $fromDomain);

$headers   = [];
$headers[] = 'From: =?UTF-8?B?' . base64_encode('DJ Vasconi — Сайт') . "?= <$fromAddr>";
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';
$headers[] = 'X-Mailer: djvasconi-website';

$ok = @mail($to, $subject, $body, implode("\r\n", $headers), '-f' . $fromAddr);

if (!$ok) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'mail_failed']);
  exit;
}

echo json_encode(['ok' => true]);