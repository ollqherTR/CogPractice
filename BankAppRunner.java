import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class BankAppRunner {
    private static final Scanner scanner = new Scanner(System.in);

    static class User {
        protected String name;
        protected String password;

        public User(String name, String password) {
            this.name = name;
            this.password = password;
        }

        public boolean updateName(String newName) {
            if (!BankApp.validate(newName)) {
                System.out.println("Invalid username");
                return false;
            }

            if (BankApp.DB.containsKey(newName)) {
                System.out.println("Username already exists");
                return false;
            }

            String currentPassword = BankApp.DB.remove(this.name);
            BankApp.DB.put(newName, currentPassword);
            this.name = newName;
            return true;
        }

        public boolean updatePassword(String newPassword) {
            if (!BankApp.validate(newPassword)) {
                System.out.println("Password is not valid");
                return false;
            }

            BankApp.DB.put(this.name, newPassword);
            this.password = newPassword;
            return true;
        }

        public void userList() {
            System.out.println("User List");
            for (String key : BankApp.DB.keySet()) {
                System.out.println("Username: " + key);
            }
        }
    }

    static class Admin extends User {
        public Admin(String name, String password) {
            super(name, password);
        }

        @Override
        public void userList() {
            System.out.println("User List");
            for (Map.Entry<String, String> entry : BankApp.DB.entrySet()) {
                System.out.println("Username: " + entry.getKey() + ", Password: " + entry.getValue());
            }
        }
    }

    static class BankApp {
        static final Map<String, String> DB = new HashMap<>();

        static {
            DB.put("admin", "admin123");
            DB.put("Alice", "AE1234");
            DB.put("Bob", "BE1234");
            DB.put("Charles", "CE1234");
            DB.put("Dawde", "DE1234");
        }

        static boolean validate(String input) {
            if (input == null || input.length() >= 100) {
                return false;
            }
            return input.matches("[A-Za-z0-9]+" );
        }

        static void printMessage(String output) {
            System.out.println(output);
        }

        static String[] myLogin() {
            printMessage("Enter username and password separated by a space");
            String input = scanner.nextLine();
            String[] parts = input.split(" ");

            if (parts.length != 2) {
                return null;
            }

            String name = parts[0];
            String password = parts[1];

            if (validate(name) && validate(password) && DB.containsKey(name) && DB.get(name).equals(password)) {
                return new String[]{name, password};
            }

            return null;
        }
    }

    public static void main(String[] args) {
        BankApp.printMessage("Welcome to this app");

        while (true) {
            BankApp.printMessage("Would you like to login? (y/n)");
            String choice = scanner.nextLine();

            if (choice.equalsIgnoreCase("n")) {
                break;
            }
            if (!choice.equalsIgnoreCase("y")) {
                BankApp.printMessage("Invalid choice");
                continue;
            }

            String[] loginData = BankApp.myLogin();
            if (loginData == null) {
                BankApp.printMessage("Invalid username or password");
                continue;
            }

            BankApp.printMessage("Login successful");
            String name = loginData[0];
            String password = loginData[1];

            if (name.equals("admin")) {
                BankApp.printMessage("Welcome admin");
                Admin adminUser = new Admin(name, password);

                while (true) {
                    BankApp.printMessage("What would you like to do? 1. View User List 2. Exit");
                    String adminChoice = scanner.nextLine();
                    if (adminChoice.equals("2")) {
                        break;
                    }
                    if (adminChoice.equals("1")) {
                        adminUser.userList();
                    } else {
                        BankApp.printMessage("Invalid choice");
                    }
                }
            } else {
                BankApp.printMessage("Welcome user");
                User user = new User(name, password);

                while (true) {
                    BankApp.printMessage("What would you like to do? 1. Update Username 2. Update Password 3. View User List 4. Exit");
                    String userChoice = scanner.nextLine();

                    if (userChoice.equals("4")) {
                        break;
                    }

                    switch (userChoice) {
                        case "1":
                            while (true) {
                                BankApp.printMessage("Enter new username");
                                String newName = scanner.nextLine();
                                if (user.updateName(newName)) {
                                    break;
                                }
                            }
                            break;
                        case "2":
                            while (true) {
                                BankApp.printMessage("Enter new password");
                                String newPassword = scanner.nextLine();
                                if (user.updatePassword(newPassword)) {
                                    break;
                                }
                            }
                            break;
                        case "3":
                            user.userList();
                            break;
                        default:
                            BankApp.printMessage("Invalid choice");
                            break;
                    }
                }
            }
        }

        BankApp.printMessage("Exiting the app");
    }
}