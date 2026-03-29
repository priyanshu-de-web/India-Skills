<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ExcelController extends Controller
{
    public function __invoke()
    {
        $this->updateExcel();

        $zip_name = Str::random() . ".xlsx";
        $zip_path = storage_path("app/excel/$zip_name");
        $zip = new \ZipArchive();
        $zip->open($zip_path, \ZipArchive::CREATE);

        $files = Storage::allFiles("/tmp");

        foreach ($files as $file) {
            $zip->addFile(storage_path("app/" . $file), ltrim($file, "tmp/"));
        }

        $zip->close();

        ob_start();

        readfile($zip_path);
        $content = ob_get_contents();

        ob_end_clean();

        return response($content)
            ->header('Content-Type', 'application/zip')
            ->header('Content-disposition', 'attachment; filename=posts.xlsx');
    }

    private function updateExcel()
    {
        $posts = \App\Models\Post::query()->withCount("comments")->get();

        $shared = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="6" uniqueCount="5">
    <si>
        <t>id</t>
    </si>
    <si>
        <t>title</t>
    </si>
    <si>
        <t>comment count</t>
    </si>
    ';

        foreach($posts as $post) {
            $shared .= '
            <si>
                <t>'. $post->id .'</t>
            </si>
            <si>
                <t>'. $post->title .'</t>
            </si>
            <si>
                <t>'. $post->comments_count .'</t>
            </si>
            ';
        }

        $shared .= '
</sst>';

        $sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
           xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
           xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
           xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"
           xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
           xmlns:etc="http://www.wps.cn/officeDocument/2017/etCustomData">
    <sheetPr/>
    <dimension ref="A1:C2"/>
    <sheetViews>
        <sheetView tabSelected="1" workbookViewId="0">
            <selection activeCell="A1" sqref="A1"/>
        </sheetView>
    </sheetViews>
    <sheetFormatPr defaultColWidth="9.14285714285714" defaultRowHeight="15" outlineLevelRow="1" outlineLevelCol="2"/>
    <sheetData>
        <row r="1" spans="1:3">
            <c r="A1" t="s">
                <v>0</v>
            </c>
            <c r="B1" t="s">
                <v>1</v>
            </c>
            <c r="C1" t="s">
                <v>2</v>
            </c>
        </row>';

        $n = 3;
        foreach($posts as $i => $post) {
            $r = $i + 2;
            $sheet .= '
        <row r="' . $r . '" spans="1:3">
            <c r="A' . $r . '">
                <v>' . $n++ . '</v>
            </c>
            <c r="B' . $r . '" t="s">
                <v>' . $n++ . '</v>
            </c>
            <c r="C' . $r . '">
                <v>' . $n++ . '</v>
            </c>
        </row>';

        }
    $sheet .= '</sheetData>
    <pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5"/>
    <headerFooter/>
</worksheet>
        ';

        $dir = storage_path("app/tmp");

        $file = fopen($dir . "/xl/sharedStrings.xml", "w");
        fwrite($file, $shared);
        fclose($file);

        $file = fopen($dir . "/xl/worksheets/sheet1.xml", "w");
        fwrite($file, $sheet);
        fclose($file);
    }
}
