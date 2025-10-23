package com.pawtrack.PawTrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.pawtrack.PawTrack"   // ✅ scan controller, model, repo, report, etc.
})
public class PawTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(PawTrackApplication.class, args);
        System.out.println("🚀 PawTrackApplication started — scanning ALL packages ✅");
    }
}
