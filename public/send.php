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
// Normalize email to handle values like "Name <addr>" or surrounding quotes/spaces
if (preg_match('/<([^>]+)>$/', $email, $m)) { $email = $m[1]; }
$email = trim($email, " \t\n\r\0\x0B\"'<>");
$email = mb_strtolower($email);
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

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
$headers[] = 'From: =?UTF-8?B?' . base64_encode('DJ Vasconi') . "?= <$fromAddr>";
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

// Връщаме отговор на клиента непосредствено — така фронтенд няма да чака за вторичния имейл и няма да покаже грешка
$response = ['ok' => true];
// Логваме състоянието на admin mail за по-лесна диагностика
$logfile = __DIR__ . '/send.log';
$logEntry = sprintf("[%s] ADMIN_OK:%d IP:%s NAME:%s EMAIL:%s TO:%s\n", date('c'), ($ok ? 1 : 0), ($_SERVER['REMOTE_ADDR'] ?? '-'), str_replace(["\r","\n"], ' ', $name), $email, $to);
@file_put_contents($logfile, $logEntry, FILE_APPEND | LOCK_EX);
echo json_encode($response);
// Опитваме да приключим връзката към клиента бързо (поддържа fastcgi_finish_request)
if (function_exists('fastcgi_finish_request')) {
  fastcgi_finish_request();
} else {
  // Бавен fallback: затваряне на връзката и продължаване на скрипта
  ignore_user_abort(true);
  if (ob_get_length()) { ob_end_flush(); }
  flush();
}

// Сега изпращаме HTML потвърдителен имейл към клиента (не блокира отговора)
$clientSubject = '=?UTF-8?B?' . base64_encode('Получихме Вашето запитване | DJ VASCONI') . '?=';
$h = function($s){ return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); };
$clientBody = '<!doctype html><html><head><meta charset="utf-8"></head><body>' .
  '<p>Здравейте,</p>' .
  '<p><strong>Благодарим Ви, че се свързахте с <span style="font-weight:700;">DJ VASCONI</span>!</strong></p>' .
  '<p>Вашето запитване беше получено успешно. Ще го прегледам лично и ще се свържа с Вас възможно най-скоро, за да обсъдим всички детайли около събитието.</p>' .
  '<h3>Получена информация:</h3>' .
  '<ul>' .
    '<li><strong>Телефон:</strong> ' . $h($phone) . '</li>' .
    '<li><strong>Дата на събитието:</strong> ' . $h($date) . '</li>' .
    '<li><strong>Тип събитие:</strong> ' . $h($eventType) . '</li>' .
    '<li><strong>Локация:</strong> ' . $h($location) . '</li>' .
  '</ul>' .
  '<p>Ако междувременно имате допълнителни въпроси, можете да ми пишете директно на този имейл или да се свържете с мен по телефона.</p>' .
  '<p>Очаквам с нетърпение възможността да бъда част от Вашия специален ден!</p>' .
  '<p>Поздрави,</p>' .
  '<p><strong>DJ VASCONI</strong></p>' .
  '<p><img src="https://fonts.gstatic.com/s/e/notoemoji/17.0/1f3a7/72.png" alt="headphones" style="width:18px;height:18px;vertical-align:middle;"/> Професионален DJ &amp; Event Host</p>' .
  '<p><img src="https://fonts.gstatic.com/s/e/notoemoji/17.0/1f310/72.png" alt="globe" style="width:18px;height:18px;vertical-align:middle;"/> <a href="https://djvasconi.bg">https://djvasconi.bg/</a></p>' .
  '<p><img src="https://djvasconi.bg/favicon.svg" alt="DJ VASCONI" style="width:96px; height:auto; display:block; margin-top:18px;" /></p>' .
  '</body></html>';

$clientHeaders = [];
$clientHeaders[] = 'From: =?UTF-8?B?' . base64_encode('DJ Vasconi') . "?= <$fromAddr>";
$clientHeaders[] = 'Reply-To: service@djvasconi.bg';
$clientHeaders[] = 'MIME-Version: 1.0';
$clientHeaders[] = 'Content-Type: text/html; charset=UTF-8';
$clientHeaders[] = 'Content-Transfer-Encoding: 8bit';

// Изпращаме, записваме резултата в лог, но не блокираме основния отговор
$clientOk = @mail($email, $clientSubject, $clientBody, implode("\r\n", $clientHeaders), '-f' . $fromAddr);
$logEntry2 = sprintf("[%s] CLIENT_OK:%d EMAIL:%s\n", date('c'), ($clientOk ? 1 : 0), $email);
@file_put_contents($logfile, $logEntry2, FILE_APPEND | LOCK_EX);

// Скриптът приключва тук (response вече е изпратен)
return;
