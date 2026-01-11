package com.vehicules.patterns.command;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class GestionnaireCommandes {

    private Stack<SoldeCommand> history = new Stack<>();
    private Stack<SoldeCommand> redoStack = new Stack<>();

    public void executeCommand(SoldeCommand command) {
        command.execute();
        history.push(command);
        redoStack.clear();
    }

    public void undo() {
        if (!history.isEmpty()) {
            SoldeCommand command = history.pop();
            command.undo();
            redoStack.push(command);
        }
    }

    public void redo() {
        if (!redoStack.isEmpty()) {
            SoldeCommand command = redoStack.pop();
            command.execute();
            history.push(command);
        }
    }

    public List<SoldeCommand> getHistory() {
        return new ArrayList<>(history);
    }

    public void clearHistory() {
        history.clear();
        redoStack.clear();
    }
}
