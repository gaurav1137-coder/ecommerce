$connString = "Server=GAURAV_SHARMA\SQLEXPRESS;Database=EcommerceDB;Trusted_Connection=True;MultipleActiveResultSets=true"
$conn = New-Object System.Data.SqlClient.SqlConnection($connString)
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT Id, Name, MobileNumber, RoleId FROM Users"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host ("User: " + $reader["Id"] + ", Name: " + $reader["Name"] + ", Mobile: " + $reader["MobileNumber"] + ", RoleId: " + $reader["RoleId"])
}
$conn.Close()
