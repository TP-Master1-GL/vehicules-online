#!/bin/bash

# Modifiez la configuration du plugin maven-compiler-plugin
if grep -q "maven-compiler-plugin" pom.xml; then
    echo "⚠️  maven-compiler-plugin existe déjà"
else
    # Ajoutez le plugin avant spring-boot-maven-plugin
    sed -i '/<plugin>/,/<\/plugin>/d' pom.xml
    cat >> pom.xml << 'COMPILER'

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>1.18.30</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
COMPILER
    echo "✅ Configuration du compilateur ajoutée"
fi
