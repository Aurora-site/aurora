# aurora

## Dev

### Generate API client

```bash
pnpm dlx openapi-typescript-codegen --input http://localhost:8000/openapi.json --output ./src/api/client --client fetch && pre-commit run --all-files
```
