// CodeExecutor.java

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import javax.tools.JavaFileObject;
import java.util.Arrays;
import java.util.Base64;
import java.io.StringWriter;
import java.net.URI;
import javax.tools.SimpleJavaFileObject;

public class CodeExecutor {
    public static void main(String[] args) {
        try {
            //Get env variables
            String codeBase64 = System.getenv("CODE");
            String input = System.getenv("INPUT");
            if (codeBase64 == null) {
                System.err.println("{\"error\":\"CODE env variable not set\"}");
                System.exit(1);
            }
            if (input == null) {
                input = "";
            }

            //Decode user’s code snippet
            String codeSnippet = new String(Base64.getDecoder().decode(codeBase64), "UTF-8");

            //Wrap the snippet in a class that implements 'CodeRunner'
            //The user snippet is just the body of run(String input).
            String userClassName = "UserCode";
            String source = ""
                + "public class " + userClassName + " implements CodeRunner {\n"
                + "    public String run(String input) {\n"
                + codeSnippet + "\n"
                + "    }\n"
                + "}";

            //Compile the code in-memory
            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            JavaFileObject fileObject = new JavaSourceFromString(userClassName, source);

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
                System.err.println("{\"error\":\"Compilation failed: " + compilerOutput + "\"}");
                System.exit(1);
            }

            //Load the compiled class
            Class<?> userClass = Class.forName(userClassName);
            CodeRunner instance = (CodeRunner) userClass.getDeclaredConstructor().newInstance();

            //Execute run(input)
            String result = instance.run(input);

            //Print result as JSON
            System.out.println("{\"result\":\"" + result + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("{\"error\":\"" + e.getMessage() + "\"}");
            System.exit(1);
        }
    }
}


interface CodeRunner {
    String run(String input);
}

// Helper for in-memory compilation
class JavaSourceFromString extends SimpleJavaFileObject {
    private final String code;

    JavaSourceFromString(String name, String code) {
        super(URI.create("string:///" + name.replace('.', '/') + Kind.SOURCE.extension), Kind.SOURCE);
        this.code = code;
    }

    @Override
    public CharSequence getCharContent(boolean ignoreEncodingErrors) {
        return code;
    }
}
