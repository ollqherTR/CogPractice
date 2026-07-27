// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class BankAppRunner {
   static Scanner sc;
   static Map<String, String> map;

   public BankAppRunner() {
   }

   public static void main(String[] var0) {
      printMessage("Welcome to our bank");
      String var1 = mylogin();
      printMessage("Welcome " + var1);
   }

   private static void printMessage(String var0) {
      System.out.println(var0);
   }

   private static String mylogin() {
      System.out.println("Please enter username and password separated by space");
      String var0 = sc.nextLine();
      String[] var1 = var0.split(" ");
      String var2 = var1[0];
      String var3 = var1[1];
      if (map.containsKey(var2) && ((String)map.get(var2)).equals(var3)) {
         System.out.println("Login successful");
         return var2;
      } else {
         System.out.println("Invalid username or password");
         return null;
      }
   }

   static {
      sc = new Scanner(System.in);
      map = new HashMap<String, String>();
      map.put("admin", "admin123");
      map.put("user2", "pass2");
      map.put("user1", "pass1");
   }
}