export function getHttpErrorInfo(code: string): {
  title: string;
  message: string;
  description: string;
  showGoBack: boolean;
} {
  const httpErrorsDict: Record<
    string,
    { title: string; message: string; description: string; showGoBack: boolean }
  > = {
    // 4xx Client Errors
    "400": {
      title: "400",
      message: "Bad Request",
      description:
        "The request could not be understood by the server due to malformed syntax.",
      showGoBack: true,
    },
    "401": {
      title: "401",
      message: "Unauthorized",
      description: "Authentication is required to access this page.",
      showGoBack: false, // Unsafe - user needs to authenticate first
    },
    "402": {
      title: "402",
      message: "Payment Required",
      description: "Payment is required to access this resource.",
      showGoBack: true,
    },
    "403": {
      title: "403",
      message: "Forbidden",
      description: "You don't have permission to access this resource.",
      showGoBack: false,
    },
    "404": {
      title: "404",
      message: "Not Found",
      description: "The page you are looking for could not be found.",
      showGoBack: true,
    },
    "405": {
      title: "405",
      message: "Method Not Allowed",
      description:
        "The request method is not supported for the requested resource.",
      showGoBack: true,
    },
    "406": {
      title: "406",
      message: "Not Acceptable",
      description:
        "The requested resource cannot generate content acceptable according to the Accept headers.",
      showGoBack: true,
    },
    "407": {
      title: "407",
      message: "Proxy Authentication Required",
      description: "Authentication with the proxy server is required.",
      showGoBack: false,
    },
    "408": {
      title: "408",
      message: "Request Timeout",
      description: "The server timed out waiting for the request.",
      showGoBack: true,
    },
    "409": {
      title: "409",
      message: "Conflict",
      description:
        "The request could not be completed due to a conflict with the current state.",
      showGoBack: true,
    },
    "410": {
      title: "410",
      message: "Gone",
      description:
        "The requested resource is no longer available and will not be available again.",
      showGoBack: true,
    },
    "411": {
      title: "411",
      message: "Length Required",
      description: "The request did not specify the length of its content.",
      showGoBack: true,
    },
    "412": {
      title: "412",
      message: "Precondition Failed",
      description:
        "One or more conditions in the request header fields evaluated to false.",
      showGoBack: true,
    },
    "413": {
      title: "413",
      message: "Payload Too Large",
      description:
        "The request entity is larger than the server is willing or able to process.",
      showGoBack: true,
    },
    "414": {
      title: "414",
      message: "URI Too Long",
      description: "The URI provided was too long for the server to process.",
      showGoBack: true,
    },
    "415": {
      title: "415",
      message: "Unsupported Media Type",
      description:
        "The request entity has a media type which the server does not support.",
      showGoBack: true,
    },
    "416": {
      title: "416",
      message: "Range Not Satisfiable",
      description:
        "The client has asked for a portion of the file that the server cannot supply.",
      showGoBack: true,
    },
    "417": {
      title: "417",
      message: "Expectation Failed",
      description:
        "The server cannot meet the requirements of the Expect request-header field.",
      showGoBack: true,
    },
    "418": {
      title: "418",
      message: "I'm a teapot",
      description:
        "The server refuses the attempt to brew coffee with a teapot.",
      showGoBack: true,
    },
    "422": {
      title: "422",
      message: "Unprocessable Entity",
      description:
        "The request was well-formed but was unable to be followed due to semantic errors.",
      showGoBack: true,
    },
    "429": {
      title: "429",
      message: "Too Many Requests",
      description:
        "Too many requests have been sent in a given amount of time.",
      showGoBack: false,
    },

    // 5xx Server Errors
    "500": {
      title: "500",
      message: "Internal Server Error",
      description: "Something went wrong on our end. Please try again later.",
      showGoBack: true,
    },
    "501": {
      title: "501",
      message: "Not Implemented",
      description:
        "The server does not support the functionality required to fulfill the request.",
      showGoBack: true,
    },
    "502": {
      title: "502",
      message: "Bad Gateway",
      description:
        "The server received an invalid response from the upstream server.",
      showGoBack: true,
    },
    "503": {
      title: "503",
      message: "Service Unavailable",
      description:
        "The server is currently unavailable. Please try again later.",
      showGoBack: false,
    },
    "504": {
      title: "504",
      message: "Gateway Timeout",
      description:
        "The server did not receive a timely response from the upstream server.",
      showGoBack: true,
    },
    "505": {
      title: "505",
      message: "HTTP Version Not Supported",
      description:
        "The server does not support the HTTP protocol version used in the request.",
      showGoBack: true,
    },
    "507": {
      title: "507",
      message: "Insufficient Storage",
      description:
        "The server is unable to store the representation needed to complete the request.",
      showGoBack: true,
    },
    "508": {
      title: "508",
      message: "Loop Detected",
      description:
        "The server detected an infinite loop while processing the request.",
      showGoBack: true,
    },
    "511": {
      title: "511",
      message: "Network Authentication Required",
      description: "Network authentication is required to gain network access.",
      showGoBack: false,
    },

    // Custom/Extended Error Codes
    "440": {
      title: "440",
      message: "Login Timeout",
      description: "Your session has expired. Please log in again.",
      showGoBack: false,
    },
    "444": {
      title: "444",
      message: "No Response",
      description:
        "The server returned no information and closed the connection.",
      showGoBack: true,
    },
    "449": {
      title: "449",
      message: "Retry With",
      description:
        "The request should be retried after performing the appropriate action.",
      showGoBack: true,
    },
    "451": {
      title: "451",
      message: "Unavailable For Legal Reasons",
      description: "The resource is unavailable due to legal reasons.",
      showGoBack: true,
    },
    "494": {
      title: "494",
      message: "Request Header Too Large",
      description: "The request header is too large for the server to process.",
      showGoBack: true,
    },
    "495": {
      title: "495",
      message: "SSL Certificate Error",
      description: "An invalid client certificate was provided.",
      showGoBack: false,
    },
    "496": {
      title: "496",
      message: "SSL Certificate Required",
      description: "A client certificate is required but was not provided.",
      showGoBack: false,
    },
    "497": {
      title: "497",
      message: "HTTP Request Sent to HTTPS Port",
      description: "An HTTP request was sent to a port expecting HTTPS.",
      showGoBack: true,
    },
    "499": {
      title: "499",
      message: "Client Closed Request",
      description:
        "The client closed the request before the server could respond.",
      showGoBack: true,
    },
  };

  return (
    httpErrorsDict[code] || {
      title: code || "Unknown",
      message: "Something went wrong",
      description:
        "An unexpected error occurred. Please try again or contact support if the problem persists.",
      showGoBack: true,
    }
  );
}
