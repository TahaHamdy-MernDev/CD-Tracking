module.exports = {
    corsOptions: {
      origin: ["http://localhost:3002","https://cd-tracking.netlify.app","https://master--cd-tracking.netlify.app/"],
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 200,
    }, 
  
    helmetOptions: {
      crossOriginEmbedderPolicy: false, 
      crossOriginResourcePolicy: {
        allowOrigins: ["http://localhost:5173","https://cd-tracking.netlify.app","https://master--cd-tracking.netlify.app/"],
      },
      contentSecurityPolicy: {
        directives: {
          imgSrc: ["*", "data:", "blob:"],
          defaultSrc: ["*"],
          scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
        },
      },
    },
    mongoSanitizeOptions: {
      dryRun: true,
      onSanitize: ({ req, key }) => {
        console.warn(`[DryRun] This request[${key}] will be sanitized`, req);
      },
    },
    rateLimitOptions: {
      windowMs: 60 * 60 * 1000, // 1 hour window
      max: 10, // Limit each IP to 10 requests per windowMs
      message: "Too many requests from this IP, please try again in an hour!",
  
      handleRateLimitExceeded: (req, res, options) => {
        res.status(429).send(options.message);
      },
    },
  };
  
