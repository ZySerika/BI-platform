package com.yupi.springbootinit.api;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class OpenAiApi {

    public static void main(String[] args) {
        System.out.println(doChat("GOAL:\\n" +
                "analyze user's increasing trend\\n" +
                "MYDATA:\\n" +
                "date, user no\\n" +
                "1st,10\\n" +
                "2nd,20\\n" +
                "3rd,30\\n"));
    }

    public static String doChat(String message) {
        String url = "https://api.openai.com/v1/chat/completions";
        String apiKey = "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"; // API key goes here
        String model = "gpt-3.5-turbo"; // current model of chatgpt api

        try {
            // Create the HTTP POST request
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Authorization", "Bearer " + apiKey);
            con.setRequestProperty("Content-Type", "application/json");

            String systemMessage = "I will send messages according to following format:\\n" +
                    "GOAL:\\n"+
                    "{the goal of the data analysis}\\n" +
                    "MYDATA:\\n"+
                    "{raw data in csv format with , as separator}\\n" +
                    "STRICT RESPONSE FORMAT (please include ~~ as shown, please please please), and you must output ~~ where instructed:\\n" +
                    "~~\\n"+
                    "{valid (JSON parsable) JSON code of the option parameter (not including the word option itself)" +
                    "from frontend typescript Echarts V5 library that represents a chart that effectively visualizes the queried data}\\n" +
                    "~~\\n" +
                    "{clear conclusion of the analysis}\\n" +
                    "~~\\n" +
                    "Again, remember ~~ and don't ask for further assistance (this is not part of output).\\n";

            // Build the request body
            String body = "{\"model\": \"" + model + "\", \"messages\": [" +
                    "{\"role\": \"system\", \"content\": \"" + systemMessage + "\"}, " +
                    "{\"role\": \"user\", \"content\": \"" + message + "\"}]}";
            //System.out.println(body);

            con.setDoOutput(true);
            OutputStreamWriter writer = new OutputStreamWriter(con.getOutputStream());
            writer.write(body);
            writer.flush();
            writer.close();

            // Get the response
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            // returns the extracted contents of the response.
            return extractContentFromResponse(response.toString());

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // This method extracts the response expected from chatgpt and returns it.
    public static String extractContentFromResponse(String response) {
        JsonElement jsonElement = JsonParser.parseString(response);

        if (jsonElement.isJsonObject()) {
            JsonObject jsonObject = jsonElement.getAsJsonObject();
            JsonElement choicesElement = jsonObject.get("choices");

            if (choicesElement.isJsonArray()) {
                JsonObject firstChoice = choicesElement.getAsJsonArray().get(0).getAsJsonObject();
                JsonObject message = firstChoice.get("message").getAsJsonObject();
                String content = message.get("content").getAsString();
                //content = content.replace("\n", "\\n");

                return content;
            }
        }
        return "gson parsing response failed";
    }
}
