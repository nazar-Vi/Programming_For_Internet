<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
            <head>
                <title>Підписники бібліотеки</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    text-align: center;
                    }
                    table {
                    width: 50%;
                    margin: auto;
                    border-collapse: collapse;
                    background-color: white;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    th, td {
                    border: 1px solid black;
                    padding: 10px;
                    }
                    th {
                    background-color: #007bff;
                    color: white;
                    }
                    tr:nth-child(even) {
                    background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h2>Список підписників</h2>
                <table border="1">
                    <tr>
                        <th>Ім'я</th>
                        <th>Адреса</th>
                        <th>Паспорт</th>
                    </tr>
                    <xsl:for-each select="library/subscriber">
                        <tr>
                            <td>
                                <xsl:value-of select="name" />
                            </td>
                            <td>
                                <xsl:value-of select="address" />
                            </td>
                            <td>
                                <xsl:value-of select="passport" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>