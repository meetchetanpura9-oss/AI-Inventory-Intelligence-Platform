import json
from app.main import app

o = app.openapi()
print('paths:')
print(json.dumps(sorted(o.get('paths', {}).keys()), indent=2))
print('\nsecuritySchemes:')
print(json.dumps(o.get('components', {}).get('securitySchemes', {}), indent=2))
print('\n/auth/me security:')
print(o.get('paths', {}).get('/auth/me', {}).get('get', {}).get('security'))
print('\n/auth/token security:')
print(o.get('paths', {}).get('/auth/token', {}).get('post', {}).get('security'))
print('\n/auth/login security:')
print(o.get('paths', {}).get('/auth/login', {}).get('post', {}).get('security'))
