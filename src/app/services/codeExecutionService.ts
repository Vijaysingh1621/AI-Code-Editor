interface ExecutionResult {
    output: string
    error: string | null
  }
  
  export async function executeCode(language: string, code: string): Promise<ExecutionResult> {
    // In a real-world scenario, this would make an API call to a secure backend
    // that can compile and run code in various languages.
    // For demonstration, we'll simulate this behavior:
  
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
  
    switch (language) {
      case "javascript":
        return executeJavaScript(code)
      case "python":
        return simulatePythonExecution(code)
      // Add cases for other languages
      default:
        return {
          output: "",
          error: `Unsupported language: ${language}`,
        }
    }
  }
  
  function executeJavaScript(code: string): ExecutionResult {
    let output = ""
    let error = null
  
    const originalLog = console.log
    console.log = (...args) => {
      output += args.join(" ") + "\n"
    }
  
    try {
      // Use Function instead of eval for slightly better security
      new Function(code)()
    } catch (e) {
      error = e instanceof Error ? e.toString() : "An error occurred"
    }
  
    console.log = originalLog
  
    return { output, error }
  }
  
  function simulatePythonExecution(code: string): ExecutionResult {
    // This is a mock function. In a real scenario, you'd send this code to a Python interpreter.
    if (code.includes("print")) {
      return {
        output: "Python output: " + code.split("print(")[1].split(")")[0],
        error: null,
      }
    } else {
      return {
        output: "",
        error: "No print statement found",
      }
    }
  }
  
  export function testCode(language: string, code: string, testCases: string[]): Promise<string[]> {
    // In a real scenario, you'd run the code against each test case
    // For now, we'll just simulate some results
    return Promise.resolve(testCases.map(() => (Math.random() > 0.5 ? "Pass" : "Fail")))
  }
  
  