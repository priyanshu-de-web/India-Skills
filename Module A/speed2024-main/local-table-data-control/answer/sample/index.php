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
    <title>Local Table Data Control</title>
    <link rel="stylesheet" href="./bootstrap.css">
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

        button {
            cursor: pointer;
        }

        td {
            text-align: center;
        }

    </style>
</head>
<body>
<form action="./update.php" method="post">
    <table class="table table-striped mb-4">
        <thead class="table-dark">
        <tr>
            <?php foreach ($json["fields"] as $field): ?>
                <td>
                    <input type="text" name="fields[]" value="<?= $field ?>" class="form-control">
                </td>
            <?php endforeach; ?>
            <td>== Delete ==</td>
        </tr>
        </thead>
        <tbody>
        <?php foreach ($json["rows"] as $row_index => $row): ?>
            <tr>
                <?php foreach ($row as $item): ?>
                    <td>
                        <input type="text" name="rows[<?= $row_index ?>][]" value="<?= $item ?>" class="form-control">
                    </td>
                <?php endforeach; ?>
                <td>
                    <button name="type" value="<?= $row_index ?>" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>

    <div class="text-end">
    <button name="type" value="add" class="btn btn-secondary">Add row</button>
    <button name="type" value="save" class="btn btn-primary">Save</button>
    </div>
</form>
</body>
</html>