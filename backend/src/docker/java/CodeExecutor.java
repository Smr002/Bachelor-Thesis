import com.google.gson.Gson;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import javax.tools.ToolProvider;
import java.io.File;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.*;
import java.util.stream.Collectors;

public class CodeExecutor {
    public static void main(String[] args) {
        try {
            // 1) Get environment variables
            String codeBase64 = System.getenv("CODE");   // Base64-encoded user code
            String methodName = System.getenv("METHOD"); // Which method to invoke
            String input = System.getenv("INPUT");       // Input to pass to the method
            
            if (codeBase64 == null) {
                System.err.println("{\"error\":\"CODE env variable not set\"}");
                System.exit(1);
            }
            if (methodName == null) {
                methodName = "run"; // default method name
            }

            // Enhanced input parsing
            Object[] parsedInputs = parseInputs(input);

            // 2) Decode user's code
            String userCode = new String(Base64.getDecoder().decode(codeBase64), "UTF-8");

            // 3) Build the complete class with user's code
            String className = "UserCode";
            String source = ""
                + "import java.util.*;\n"
                + "import java.util.stream.*;\n"
                + "import java.math.*;\n"
                + "import java.util.function.*;\n"
                + "import java.util.concurrent.*;\n"
                + "import java.util.regex.*;\n"
                + "\n"
                + "public class " + className + " {\n"
                + userCode + "\n"
                + "}\n";

            // 4) Compile the source in-memory, outputting .class to /sandbox/compiled-classes
            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            JavaFileObject fileObject = new JavaSourceFromString(className, source);

            StringWriter compilerOutput = new StringWriter();
            boolean success = compiler.getTask(
                compilerOutput,
                null,
                null,
                Arrays.asList("-d", "/sandbox/compiled-classes"), 
                null,
                Arrays.asList(fileObject)
            ).call();

            if (!success) {
                System.err.println("{\"error\":\"Compilation failed: " 
                    + compilerOutput.toString().replace("\"", "\\\"") + "\"}");
                System.exit(1);
            }

            // 5) Load the compiled class from /sandbox/compiled-classes
            URLClassLoader classLoader = new URLClassLoader(
                new URL[] { new File("/sandbox/compiled-classes").toURI().toURL() }
            );
            Class<?> userClass = Class.forName(className, true, classLoader);
            Object instance = userClass.getDeclaredConstructor().newInstance();

            // 6) Find the requested method
            Method[] methods = userClass.getDeclaredMethods();
            Method targetMethod = findSuitableMethod(methods, methodName, parsedInputs);

            if (targetMethod == null) {
                StringBuilder error = new StringBuilder("{\"error\":\"No suitable method found. Available methods: ");
                for (Method m : methods) {
                    error.append(m.getName())
                         .append("(")
                         .append(Arrays.stream(m.getParameterTypes())
                               .map(Class::getSimpleName)
                               .collect(Collectors.joining(", ")))
                         .append(") ");
                }
                error.append("\"}");
                System.err.println(error.toString());
                System.exit(1);
            }

            // 7) Invoke the method with parsed parameters
            Object result = targetMethod.invoke(instance, parsedInputs);

            // Enhanced result handling
            String jsonResult = formatResult(result);
            System.out.println(jsonResult);

        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            System.err.println("{\"error\":\"" + sw.toString().replace("\"", "\\\"") + "\"}");
            System.exit(1);
        }
    }

    private static Object[] parseInputs(String input) {
        if (input == null || input.isEmpty()) {
            return new Object[0];
        }

        List<Object> params = new ArrayList<>();
        Gson gson = new Gson();

        // Split by comma but not within brackets or quotes
        String[] parts = input.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)(?![^\\[]*\\])");
        
        for (String part : parts) {
            String cleaned = part.trim();
            if (cleaned.contains("=")) {
                cleaned = cleaned.substring(cleaned.indexOf("=") + 1).trim();
            }
            
            try {
                if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
                    // Try parsing as int array first
                    try {
                        params.add(gson.fromJson(cleaned, int[].class));
                    } catch (Exception e) {
                        // Try parsing as String array if int array fails
                        params.add(gson.fromJson(cleaned, String[].class));
                    }
                } else if (cleaned.startsWith("\"") && cleaned.endsWith("\"")) {
                    // String parameter
                    params.add(cleaned.substring(1, cleaned.length() - 1));
                } else {
                    // Try parsing as number
                    try {
                        if (cleaned.contains(".")) {
                            params.add(Double.parseDouble(cleaned));
                        } else {
                            params.add(Integer.parseInt(cleaned));
                        }
                    } catch (NumberFormatException e) {
                        // If not a number, add as string
                        params.add(cleaned);
                    }
                }
            } catch (Exception e) {
                params.add(cleaned); // Fall back to string if parsing fails
            }
        }
        
        return params.toArray();
    }

    private static Method findSuitableMethod(Method[] methods, String methodName, Object[] params) {
        // First try exact name and parameter count match
        for (Method method : methods) {
            if (method.getName().equals(methodName) && 
                method.getParameterCount() == params.length &&
                parametersMatch(method.getParameterTypes(), params)) {
                return method;
            }
        }
        
        // If no exact match, try finding any method with matching parameter types
        for (Method method : methods) {
            if (method.getParameterCount() == params.length &&
                parametersMatch(method.getParameterTypes(), params)) {
                return method;
            }
        }
        
        return null;
    }

    private static boolean parametersMatch(Class<?>[] paramTypes, Object[] params) {
        if (paramTypes.length != params.length) return false;
        
        for (int i = 0; i < paramTypes.length; i++) {
            if (params[i] == null) continue;
            
            Class<?> paramType = paramTypes[i];
            Class<?> inputType = params[i].getClass();
            
            if (paramType.isArray() && inputType.isArray()) {
                if (!paramType.getComponentType().isAssignableFrom(inputType.getComponentType())) {
                    return false;
                }
            } else if (!paramType.isAssignableFrom(inputType) && 
                       !isPrimitiveMatch(paramType, inputType)) {
                return false;
            }
        }
        return true;
    }

    private static boolean isPrimitiveMatch(Class<?> paramType, Class<?> inputType) {
        if (!paramType.isPrimitive()) return false;
        
        return (paramType == int.class && inputType == Integer.class) ||
               (paramType == double.class && inputType == Double.class) ||
               (paramType == boolean.class && inputType == Boolean.class) ||
               (paramType == long.class && inputType == Long.class);
    }

    private static String formatResult(Object result) {
        if (result == null) {
            return "{\"result\":null}";
        }

        Gson gson = new Gson();
        if (result.getClass().isArray()) {
            return "{\"result\":" + gson.toJson(result) + "}";
        } else {
            return "{\"result\":\"" + result.toString().replace("\"", "\\\"") + "\"}";
        }
    }
}

// Helper class for in-memory compilation
class JavaSourceFromString extends SimpleJavaFileObject {
    private final String code;

    JavaSourceFromString(String name, String code) {
        super(URI.create("string:///" + name.replace('.', '/') 
                         + Kind.SOURCE.extension), Kind.SOURCE);
        this.code = code;
    }

    @Override
    public CharSequence getCharContent(boolean ignoreEncodingErrors) {
        return code;
    }
}
