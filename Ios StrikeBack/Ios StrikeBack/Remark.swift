//
//  Remark.swift
//  Ios StrikeBack
//
//  Created by user164174 on 2/27/20.
//  Copyright © 2020 user164174. All rights reserved.
//

import Foundation
import SwiftUI

class Remark : ObservableObject, Identifiable, Codable{
    @Published var userId : String
    @Published var postId : String
    @Published var title : String
    @Published var text : String
    @Published var image : UIImage
    @Published var date : Date
    @Published var heard : Int
   
    init(postId : String, userId : String, title : String, text : String, image : UIImage, date : Date, heard : Int){
        self.postId = postId
        self.userId = userId
        self.title = title
        self.text = text
        self.image = image
        self.date = date
        self.heard = heard
    }
    
 
   
    
    private enum CodingKeys : String, CodingKey{
        case userId = "userId"
        case title = "title"
        case text = "text"
        case image = "image"
        case date = "date"
        case postId = "_id"
        case heard = "heard"
    }
    
    
    required init(from decoder : Decoder) throws{
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.userId  = try container.decode(String.self, forKey: .userId)
        self.postId  = try container.decode(String.self, forKey: .postId)
        self.title = try container.decode(String.self, forKey: .title)
        self.text = try container.decode(String.self, forKey: .text)
        let imagestring : String = try container.decode(String.self, forKey: .image)
        let isodate : String = try container.decode(String.self, forKey: .date)
        self.heard = try container.decode(Int.self, forKey: .heard)
        
        let dateF = DateFormatter()
        dateF.dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        
        self.date = dateF.date(from: isodate.components(separatedBy: ".")[0])!
        
        image = UIImage()
        if(imagestring != nil || imagestring != "" || imagestring != "none"){
        if let dataDecoded:NSData = NSData(base64Encoded: imagestring, options: NSData.Base64DecodingOptions(rawValue: 0))!{
            guard let myimage = UIImage(data: dataDecoded as Data) else{print("No image in remark"); return}
        }
        }
        //let imagedata = Data(base64Encoded: imagestring)
        /*if let imagedata = imagedata{
                self.image = UIImage		(data: imagedata)
        }*/
        
        
        
        
        
    }
    
    func encode(to encoder: Encoder) throws {
        let imagedata = image.jpegData(compressionQuality: 0.1)
        let imagestring = imagedata?.base64EncodedString()
        
        
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(userId, forKey: .userId)
        try container.encode(title, forKey: .title)
        try container.encode(text, forKey: .text)
        
        try container.encode(postId, forKey: .postId)
        if let imagestring = imagestring {
            //print(imagestring)
            try container.encode(imagestring, forKey: .image)
        }else {
            print("imagestring value is nil")
            try container.encode("none", forKey: .image)
        }
    }
    
}
