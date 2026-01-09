package com.vehicules.patterns.command;

import java.util.Stack;

public class GestionnaireCommandes {
    private Stack<SoldeCommand> history = new Stack<>();
    
    public void executeCommand(SoldeCommand command) {
        command.execute();
        history.push(command);
    }
    
    public void undo() {
        if (!history.isEmpty()) {
            SoldeCommand command = history.pop();
            command.undo();
        }
    }
    
    public void redo(SoldeCommand command) {
        executeCommand(command);
    }
}