package com.vehicules.patterns.command;

public interface SoldeCommand {

    void execute();

    void undo();

    String getDescription();
}
