$connString = "Server=EcommerceDB11.mssql.somee.com;Database=EcommerceDB11;User Id=gaurav1137_SQLLogin_1;Password=5dc8nxjhn3;TrustServerCertificate=True"
$conn = New-Object System.Data.SqlClient.SqlConnection($connString)
try {
    $conn.Open()
    Write-Host "Connection Successful!"
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = "SELECT COUNT(*) FROM Users"
    $userCount = $cmd.ExecuteScalar()
    Write-Host "Total Users in DB: $userCount"

    $cmd.CommandText = "SELECT COUNT(*) FROM Products"
    $productCount = $cmd.ExecuteScalar()
    Write-Host "Total Products in DB: $productCount"
    
    $cmd.CommandText = "SELECT TOP 5 Id, Name, MobileNumber, RoleId FROM Users"
    $reader = $cmd.ExecuteReader()
    Write-Host "`n--- TOP 5 USERS ---"
    while ($reader.Read()) {
        Write-Host ("Id: " + $reader["Id"] + " | Name: " + $reader["Name"] + " | Mobile: " + $reader["MobileNumber"] + " | RoleId: " + $reader["RoleId"])
    }
    $reader.Close()

    $cmd.CommandText = "SELECT TOP 5 Id, Name, Price FROM Products"
    $reader = $cmd.ExecuteReader()
    Write-Host "`n--- TOP 5 PRODUCTS ---"
    while ($reader.Read()) {
        Write-Host ("Id: " + $reader["Id"] + " | Name: " + $reader["Name"] + " | Price: " + $reader["Price"])
    }
    $reader.Close()

} catch {
    Write-Host "Error connecting to DB: $_"
} finally {
    $conn.Close()
}
