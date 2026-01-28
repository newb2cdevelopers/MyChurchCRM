export const getAsyncResult = async asyncFunction => {
  try {
    const result = await asyncFunction;

    if (result && !result.ok) {
      // Try to parse error response as JSON to get detailed error message
      try {
        const errorData = await result.json();
        return [null, { ...errorData, statusCode: result.status }];
      } catch (jsonError) {
        // If JSON parsing fails, return basic error info
        return [
          null,
          {
            statusCode: result.status,
            message: `Status code ${result.status}`,
          },
        ];
      }
    }

    try {
      var jsonData = await result.json();
      return [jsonData, null];
    } catch (err) {
      return [null, err];
    }
  } catch (error) {
    return [null, error];
  }
};
