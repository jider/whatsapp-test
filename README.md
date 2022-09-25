# Database
## QRCodes
* Delete table: `aws dynamodb delete-table --table-name QRCodes --endpoint-url http://localhost:8042`
* Describe table: `aws dynamodb describe-table --table-name QRCodes --endpoint-url http://localhost:8042`
* Scan (get all data): `aws dynamodb scan --table-name QRCodes --endpoint-url http://localhost:8042`