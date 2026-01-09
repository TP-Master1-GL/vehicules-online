package com.vehicules.patterns.bridge;

public interface FormService {
    String renderForm();
    void submitForm(String data);
    String getFormType();
}