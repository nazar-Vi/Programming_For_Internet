<?php
session_start();

$max_value = $_POST['max_value'] ?? 20;
$sign = $_POST['sign'] ?? $_SESSION['sign'] ?? '+';
$answer = $_POST['answer'] ?? '';
$message = '???';

// Ініціалізація вводу
if (!isset($_SESSION['input'])) $_SESSION['input'] = '';

if (isset($_POST['digit'])) {
    $_SESSION['input'] .= $_POST['digit'];
}

if (isset($_POST['clear'])) {
    $_SESSION['input'] = '';
}

$input = $_SESSION['input'];

// Генерація прикладу
if (!isset($_SESSION['operand1']) || isset($_POST['new_task']) || isset($_POST['sign']) || isset($_POST['max_value'])) {
    $operand1 = rand(0, $max_value);
    if ($sign === '+') {
        $operand2 = rand(0, $max_value - $operand1);
    } elseif ($sign === '-') {
        $operand2 = rand(0, $operand1);
    } elseif ($sign === '*') {
        $operand2 = rand(0, floor($max_value / 2));
    }

    $_SESSION['operand1'] = $operand1;
    $_SESSION['operand2'] = $operand2;
    $_SESSION['sign'] = $sign;
    $_SESSION['input'] = '';
} else {
    $operand1 = $_SESSION['operand1'];
    $operand2 = $_SESSION['operand2'];
    $sign = $_SESSION['sign'];
}

// Розрахунок правильної відповіді
switch ($sign) {
    case '+': $result = $operand1 + $operand2; break;
    case '-': $result = $operand1 - $operand2; break;
    case '*': $result = $operand1 * $operand2; break;
    default: $result = 0;
}

// Перевірка відповіді
if (isset($_POST['check'])) {
    $message = ((int)$input === $result) ? 'Вірно!' : 'Спробуй ще!';
    $_SESSION['input'] = ''; // Очистити ввід
}
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Перевірка усного рахунку на PHP</title>
    <link rel="stylesheet" href="math-style.css">
</head>
<body>
    <h1 class="center">Математичний тест (PHP)</h1>
    <hr>

    <form method="post" class="center">
        <!-- Діапазон -->
        <div>
            <button name="max_value" value="10">0–10</button>
            <button name="max_value" value="20">0–20</button>
            <button name="max_value" value="100">0–100</button>
            <button name="max_value" value="500">0–500</button>
        </div>

        <!-- Операції -->
        <div>
            <button name="sign" value="+">+</button>
            <button name="sign" value="-">−</button>
            <button name="sign" value="*">×</button>
        </div>
        <hr>

        <!-- Приклад -->
        <div>
            <input type="text" readonly size="3" value="<?= $operand1 ?>">
            <input type="text" readonly size="1" value="<?= $sign ?>">
            <input type="text" readonly size="3" value="<?= $operand2 ?>">
            =
            <input type="text" name="answer" value="<?= htmlspecialchars($input) ?>" readonly size="5">
            <button type="submit" name="check">Перевірити</button>
            <button type="submit" name="new_task">?</button>
        </div>

        <h3><?= $message ?></h3>

        <!-- Клавіатура -->
        <table id="keyboard">
            <?php
            $buttons = [
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
                ['0']
            ];
            foreach ($buttons as $row) {
                echo "<tr>";
                foreach ($row as $digit) {
                    echo "<td><button type='submit' name='digit' value='$digit' id='b$digit'>$digit</button></td>";
                }
                if (count($row) === 1) {
                    echo "<td colspan='2'><button type='submit' id='bs' name='check'>OK</button></td>";
                }
                echo "</tr>";
            }
            ?>
        </table>
    </form>
</body>
</html>
