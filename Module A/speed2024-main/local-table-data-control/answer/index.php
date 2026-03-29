<?php

$json = json_decode(file_get_contents("./table.json"), true);

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

    </style>
</head>
<body>
<form action="./update.php" method="post">
    <table border="1">
        <thead>
        <tr>
            <?php foreach ($json["fields"] as $field): ?>
                <td>
                    <input type="text" name="fields[]" value="<?= $field ?>">
                </td>
            <?php endforeach; ?>
            <td>== action ==</td>
        </tr>
        </thead>
        <tbody>
        <?php foreach ($json["rows"] as $row_index => $row): ?>
            <tr>
                <?php foreach ($row as $item): ?>
                    <td>
                        <input type="text" name="rows[<?= $row_index ?>][]" value="<?= $item ?>">
                    </td>
                <?php endforeach; ?>
                <td>
                    <button name="type" value="<?= $row_index ?>">Delete</button>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    <button name="type" value="add">Add row</button>
    <button name="type" value="save">Save</button>
</form>
</body>
</html>