//
//  UserDAO.swift
//  Ios StrikeBack
//
//  Created by user164174 on 3/1/20.
//  Copyright © 2020 user164174. All rights reserved.
//

import Foundation

public class UserDAO {
    
    static let rootURL : String = "https://strike-back.herokuapp.com/users/"

    //----------------------------------
    //---------- POST requests ---------
    //----------------------------------

    static func signup (pseudo : String, password : String, email : String, color : String) -> Bool{
        // Prepare URL
        let url = URL(string: UserDAO.rootURL + "signup")
        guard let requestUrl = url else { fatalError() }
        // Prepare URL Request Object
        var request = URLRequest(url: requestUrl)
        request.httpMethod = "POST"
        
        let semaphore = DispatchSemaphore(value :0)
        var res : Bool = false
        //----------------------------------------------------------
        //___________verifier si ca marche de cette facon___________
        //__________________________________________________________
        let json: [String: Any] = ["pseudo": pseudo,"password": password, "email": email, "color": color ]
        // Set HTTP Request Body
        do {
            request.httpBody = try? JSONSerialization.data(withJSONObject: json) 
        } catch let error {
            print(error)
        }
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        print("json : " , String(data : request.httpBody!, encoding: .utf8)!)
        // Perform HTTP Request
         let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            if let error = error {
                print("Error took place \(error)")
                return
            }
                
                let resp = response as? HTTPURLResponse
                res = (resp?.statusCode == 200)
                
            if let data = data{
                if let jsonString = String(data: data, encoding: .utf8){
                    print(jsonString)
                }
            }
            semaphore.signal()
        }
        task.resume()
        semaphore.wait()
        return res
    }
    
    static func login (pseudo : String, password : String) -> User?{

        return nil
    }
    
    //----------------------------------
    //---------- PUT requests ----------
    //----------------------------------

    
    static func updatePassword (userId : String, oldPassword : String,  newPassword : String) -> Bool{

           return false
       }
    
    static func updateColor (userId : String, color : String) -> Bool{

           return false
       }
    
    //----------------------------------
    //---------- DELETE requests -------
    //----------------------------------

    static func deleteUser(userId : String) -> Bool{

           return false
       }
}
