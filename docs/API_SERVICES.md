# API Services

## Overview

The application uses **Axios v1** for HTTP requests. API access is managed through a centralized `ApiClient` factory and domain-specific service classes.

## ApiClient (Core)

`src/services/ApiClient.ts` is a static factory that manages named Axios instances:

```typescript
class ApiClient {
  static client: { [key: string]: AxiosInstance } = {};

  static init(clientName: string, baseURL?: string) {
    ApiClient.client[clientName] = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
}
```

Each service initializes its own named client, so different APIs can have different base URLs and configurations.

## ApiError (Base Error Class)

`src/services/ApiError.ts` provides a base error class for API errors:

```typescript
export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: string) { ... }
}
```

Service-specific error classes extend `ApiError`:

```typescript
export class SampleError extends ApiError {
  constructor(message: string, statusCode?: string, stack?: string) {
    super(message, statusCode);
    this.name = 'SampleError';
  }
}
```

## Creating a New Service

Follow the pattern from `src/services/sample/index.ts`:

### Step 1: Create the service folder

```
src/services/myService/
└── index.ts
```

### Step 2: Define the service class

```typescript
import { AxiosError } from 'axios';
import ApiClient from '../ApiClient';
import { ApiError } from '../ApiError';

// 1. Custom error class (optional but recommended)
export class MyServiceError extends ApiError {
  constructor(message: string, statusCode?: string, stack?: string) {
    super(message, statusCode);
    this.name = 'MyServiceError';
    this.message = message;
    this.stack = stack;
  }
}

// 2. Service class
class MyService {
  static id = 'MyService';

  // Accessor for the named Axios client
  static get client() {
    return ApiClient.client[MyService.id];
  }

  // Initialize with a base URL
  static async init(baseURL: string) {
    ApiClient.init(MyService.id, baseURL);
  }

  // Set the authorization header
  static async authorize(accessToken?: string) {
    const authHeaderValue = accessToken ? `Bearer ${accessToken}` : undefined;
    this.client.defaults.headers.common['Authorization'] = authHeaderValue;
  }

  // Group API endpoints by resource
  static MyResource = {
    async GetAll() {
      try {
        const response = await MyService.client.get('/my-resource');
        return response.data;
      }
      catch (error: unknown) {
        if (error instanceof AxiosError) {
          throw new MyServiceError(error.message, error.code);
        }
        throw new MyServiceError('An unexpected error occurred.');
      }
    },
  };
}

export default MyService;
```

### Step 3: Initialize in the application bootstrap

In `src/index.tsx`, call `init()` before the app renders:

```typescript
import MyService from './services/myService';

MyService.init(window.env.PUBLIC_MY_SERVICE_API_URL);
```

## Service Conventions

| Convention | Detail |
|---|---|
| Static class pattern | Services are static classes, not instantiated |
| Named client | Each service has a unique `id` used to register its Axios instance |
| `client` getter | Access the Axios instance via `static get client()` |
| Resource grouping | Group related endpoints as static properties (e.g., `MyService.Games.GetAll()`) |
| Error wrapping | Catch `AxiosError` and wrap it in a service-specific error class |

## Testing Services

Co-locate tests next to the service file (e.g., `src/services/ApiClient.test.ts`) and mock Axios:

```typescript
import axios from 'axios';
import { vi } from 'vitest';
import ApiClient from './ApiClient';

vi.mock('axios');
const mockAxios = vi.mocked(axios);

describe('ApiClient', () => {
  beforeEach(() => {
    ApiClient.client = {};
  });

  it('initializes an Axios instance', () => {
    ApiClient.init('myService', 'https://api.example.com/');

    expect(mockAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com/',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  });
});
```

## Environment Variables for API URLs

API base URLs come from runtime environment variables injected via `public/environment.js`. To type a new env var, add it to the `Window.env` interface in `src/runtime-env.ts`:

```typescript
declare global {
  interface Window {
    env: {
      PUBLIC_MY_SERVICE_API_URL?: string;
    };
  }
}
```

The `public/environment.js` file is the runtime source of these values (populated at deploy time).
