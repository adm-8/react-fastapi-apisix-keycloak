```
curl -X POST \
    -d "client_id=fastapi-client" \
    -d "client_secret=K5ZIzE9BSlW8jGTwdybvVMkNTcW7hn1K" \
    -d "grant_type=client_credentials" \
    -d "audience=fastapi-client" \
    http://localhost:8080/realms/myrealm/protocol/openid-connect/token
```

```
TOKEN=$(curl -X POST -d "client_id=fastapi-client" -d "grant_type=client_credentials" -d "client_secret=K5ZIzE9BSlW8jGTwdybvVMkNTcW7hn1K" -d "grant type=client_credentials" http://localhost:8080/realms/myrealm/protocol/openid-connect/token | jq -r '.access_token')

echo $TOKEN

```

```
curl -X 'GET' 'http://localhost:8000/api/protected' -H "Authorization: Bearer $TOKEN"
```


```
docker compose up
```

```
docker run -p 127.0.0.1:8080:8080 \
    -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
    -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
    quay.io/keycloak/keycloak:26.4.2 start-dev
```