const express = require('express');
const http=require('http');
const app = express();
const port=process.env.PORT|| 3000;

const path = require('path');


const loc = path.join(__dirname + '/public/html');
app.use(express.static(loc))

//route weather

app.get('/weather',(req,res)=>{
    console.log(req.query);
    if(!req.query.address){
        return res.send({
            "error":"Please specify a address after the address like \"/weather?address=somethings\" to continue."
        })
    }
    const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(req.query.address)}.json?access_token=pk.eyJ1Ijoicm9oaXRzYWNoMjciLCJhIjoiY2tvdmFidTN5MDZleTJ1cnMyc2NhcDN2dyJ9.H91adSv6_-b0dQhyVzv24A&limit=1;`;

    http.get(url,(response)=>{

        let data=[];
        response.on('data',(chunk)=>{
            data.push(chunk)
        })
        response.on('end',()=>{
            
            data = JSON.parse(data.toString());
            if (data.features.length > 0 && data.features[0].center.length > 0) {
                const url=`http://api.weatherstack.com/current?access_key=3d264371907172be883c03ba10fa37e3&query=${data.features[0].center[1]},${data.features[0].center[0]}`
                http.get(url,(resp)=>{
                    let da=[];
                    resp.on('data',(chunk)=>{
                        da.push(chunk)
                    })
                    resp.on('end',()=>{
                        res.send(JSON.parse(da));
                    })
                })
                
            }
            else
            return res.send({"error":"not able to fetch location."})
            
            
        })
    }).on('error',()=>{
        console.log('inside');        
         res.send({"error":"not able to fetch location."})
    })
    
    
})



app.listen(port, () => {
    console.log(`server is up and listening at port ${port}`);

})


