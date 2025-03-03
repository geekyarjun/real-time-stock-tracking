# Funding Pips - Senior Frontend Engineer Assessment


  ## How to run the project
```bash

npm  install

```

```bash

npm  run dev

```

## Architectural Decisions

### 1. **Project Structure**

-   The project follows a modular folder structure inside `src/`:
    
    -   `app/` → Next.js App Router pages and layouts
        
    -   `components/` → Reusable UI components
        
    -   `hooks/` → Custom React hooks for data fetching & state management
        
    -   `lib/` → Utility functions and configurations (e.g., API clients)
        
    -   `providers/` → Context providers and global state management
        
    -   `styles/` → Tailwind and global CSS styles
        
    -   `types/` → TypeScript type definitions
        

**Decision Rationale:**

-   Helps maintain a clean separation of concerns.
    
-   Encourages reusability and maintainability.
    
-   Keeps API interactions and logic separate from UI components.
    

----------

### 2. **Data Fetching Strategy**

-   **React Query (**useQuery** **&** **usePrefetchQuery**)** for fetching paginated stock data.
    
-   **Polling/WebSockets:** To get live stock price updates.
    
-   **Caching & Revalidation:** Data is cached and refreshed at a defined interval.
    
-   **Error Handling:** Managed via React Query's built-in error states and Toast notifications.
    

**Trade-off:**

-   **Polling:** Simpler implementation but increases API requests.
    
-   **WebSockets:** Reduces latency and API calls but requires persistent connections and extra setup.
    

----------

### 3. **Stock Chart Integration**

-   Uses **TradingView Widget** for real-time stock visualization.
    
-   Embeds TradingView via a `<script>` tag dynamically inside a React component.
    

**Decision Rationale:**

-   Offloads chart rendering complexity to TradingView.
    
-   Provides advanced features without additional development effort.
    
-   Avoids direct Canvas/WebGL-based implementation.
    

----------

### 4. **Authentication Strategy (Optional)**

-   **NextAuth.js** configured under `src/app/api/auth/[...nextauth]/route.ts`.
    
-   Supports OAuth providers (Google, GitHub) and JWT-based authentication.
    
-   Session management via cookies and JWT.
    

**Decision Rationale:**

-   Easily integrates with Next.js App Router.
    
-   Provides built-in session handling and security.
    
-   Reduces boilerplate code for authentication flows.
    

----------

### 5. **Styling and Theming**

-   Uses **Tailwind CSS** for utility-first styling.
    
-   Global styles managed in `styles/`.
    
-   Dark mode support can be added using Tailwind's `dark:` utilities.
    

**Decision Rationale:**

-   Faster development with utility-based CSS.
    
-   Eliminates the need for external CSS frameworks.
    
-   Tailwind ensures design consistency across components.
    

----------

### 6. **Testing Strategy**

-   **Unit Testing:** Jest + React Testing Library for components and hooks.
 
   
    

**Decision Rationale:**

-   Ensures core functionalities work as expected.
    
-   Prevents regressions during updates.
    
-   Improves code reliability and confidence in deployments.
    

----------

### 7. **Deployment & CI/CD**

-   **Deployment Target:** Vercel (Next.js optimized hosting).
    
-   **CI/CD:** GitHub Actions for automated testing and deployment.
    
-   **Environment Variables:** Managed via `.env` files for API keys and secrets.
    

**Decision Rationale:**

-   Vercel provides built-in optimizations for Next.js apps.
    
-   Automated deployments ensure rapid iteration and rollback capabilities.
    
-   Environment variable separation enhances security.
    

----------

## Future Considerations

-   **Switch from Polling to WebSockets**: If polling proves inefficient, consider using WebSockets for real-time stock updates.
    
-   **Offline Support**: Use React Query’s offline caching strategies for better user experience.
    
-   **Internationalization (i18n)**: Implement language support for a global audience.

-   **Monitoring (sentry)**: Monitor performance and error using sentry 

  

## Tradeoffs made

- Polling vs Real-Time Updates
-- I am doing polling of http request here because it is easier and quicker to implement.
-- I don't need to have a websocket or a real-time backend
-- I have used react-query for polling which will manage the caching efficiently and do all the internal logic for us
-- I have used react-query for prefetching of data in the server component so that in client component data will be available immediately
-- With polling each client repeatedly makes HTTP requests, that will increase the server stress.

- Next-auth for implementing Oauth
--   NextAuth provides built-in support for many OAuth providers, which requiring minimal setup.
--   Pre-configured OAuth flows make it easy to integrate Google, GitHub, and other providers.
--   Securely manages OAuth tokens and refresh tokens.
--   CSRF Protection Protects against Cross-Site Request Forgery attacks.
--   Session Management Handles user sessions with minimal configuration.

- Shadcn/ui components
-- I prefered to use shadcn as the component library because it provides a high level of customization. I can directly edit the code of any component I want.

If I would have more time I will implement websocket based backend which give results like:
**Real-time Updates**: No delays; data is pushed instantly when available.  
**Efficient Resource Usage**: No need for repeated requests, reducing network and server load. 

