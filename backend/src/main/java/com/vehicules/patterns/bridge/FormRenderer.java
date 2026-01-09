package com.vehicules.patterns.bridge;

public interface FormRenderer {
    String render(String formName, String[] fields, String[] fieldTypes);
    void processSubmission(String data);
}