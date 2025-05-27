<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лабораторна робота 2-2-PHP - Варіант 2</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        input[type="text"]:focus {
            border-color: #4CAF50;
            outline: none;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            margin: 15px 0;
        }
        input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.2);
        }
        .checkbox-label {
            font-size: 16px;
            cursor: pointer;
        }
        input[type="submit"] {
            background-color: #4CAF50;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
        }
        input[type="submit"]:hover {
            background-color: #45a049;
        }
        .result {
            margin-top: 30px;
            padding: 20px;
            background-color: #e8f5e8;
            border-left: 4px solid #4CAF50;
            border-radius: 5px;
        }
        .result h2 {
            color: #2e7d32;
            margin-top: 0;
        }
        .stat {
            background-color: #f0f8ff;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 3px solid #2196F3;
        }
        .displayed-text {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ffeaa7;
            font-family: monospace;
            font-size: 18px;
            word-break: break-all;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Лабораторна робота 2-2-PHP<br>Варіант 2</h1>
        
        <form method="post" action="">
            <div class="form-group">
                <label for="text_input">Введіть текст:</label>
                <input type="text" id="text_input" name="text_input" 
                       value="<?php echo isset($_POST['text_input']) ? htmlspecialchars($_POST['text_input']) : ''; ?>" 
                       placeholder="Наприклад: Hello123World456">
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="show_numbers" name="show_numbers" 
                       <?php echo isset($_POST['show_numbers']) ? 'checked' : ''; ?>>
                <label for="show_numbers" class="checkbox-label">
                    Показати тільки цифри з введеного тексту
                </label>
            </div>
            
            <input type="submit" value="Обробити текст">
        </form>

        <?php
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $inputText = $_POST['text_input'] ?? '';
            $showNumbersOnly = isset($_POST['show_numbers']);
            
            if (!empty($inputText)) {
                echo '<div class="result">';
                echo '<h2>Результат обробки:</h2>';
                
                // Підрахунок загальної кількості символів
                $totalCharacters = strlen($inputText);
                
                if ($showNumbersOnly) {
                    // Виділяємо тільки цифри з тексту
                    $numbersOnly = preg_replace('/[^0-9]/', '', $inputText);
                    $displayedCharacters = strlen($numbersOnly);
                    
                    echo '<div class="stat">';
                    echo '<strong>Режим:</strong> Показано тільки цифри';
                    echo '</div>';
                    
                    echo '<div class="stat">';
                    echo '<strong>Оригінальний текст:</strong> ' . htmlspecialchars($inputText);
                    echo '</div>';
                    
                    echo '<div class="stat">';
                    echo '<strong>Виділені цифри:</strong>';
                    echo '</div>';
                    echo '<div class="displayed-text">';
                    if (!empty($numbersOnly)) {
                        echo $numbersOnly;
                    } else {
                        echo '<em style="color: #666;">Цифр не знайдено</em>';
                    }
                    echo '</div>';
                    
                } else {
                    // Показуємо весь текст
                    $displayedCharacters = $totalCharacters;
                    
                    echo '<div class="stat">';
                    echo '<strong>Режим:</strong> Показано весь текст';
                    echo '</div>';
                    
                    echo '<div class="stat">';
                    echo '<strong>Відображений текст:</strong>';
                    echo '</div>';
                    echo '<div class="displayed-text">';
                    echo htmlspecialchars($inputText);
                    echo '</div>';
                }
                
                // Статистика
                echo '<div class="stat">';
                echo '<strong>Загальна кількість символів в оригінальному тексті:</strong> ' . $totalCharacters;
                echo '</div>';
                
                echo '<div class="stat">';
                echo '<strong>Кількість символів, що відображаються:</strong> ' . $displayedCharacters;
                echo '</div>';
                
                if ($showNumbersOnly) {
                    $nonDigitCount = $totalCharacters - $displayedCharacters;
                    echo '<div class="stat">';
                    echo '<strong>Кількість нецифрових символів (приховано):</strong> ' . $nonDigitCount;
                    echo '</div>';
                }
                
                echo '</div>';
            } else {
                echo '<div class="result" style="background-color: #ffebee; border-left-color: #f44336;">';
                echo '<h2 style="color: #c62828;">Помилка!</h2>';
                echo '<p>Будь ласка, введіть текст для обробки.</p>';
                echo '</div>';
            }
        }
        ?>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h3>Інструкція:</h3>
            <ol>
                <li>Введіть будь-який текст у текстове поле</li>
                <li>Встановіть прапорець, якщо хочете показувати тільки цифри</li>
                <li>Натисніть кнопку "Обробити текст"</li>
                <li>Перегляньте результат та статистику символів</li>
            </ol>
            <p><strong>Приклад:</strong> Якщо ввести "Hello123World456" та встановити прапорець, буде показано тільки "123456"</p>
        </div>
    </div>
</body>
</html>