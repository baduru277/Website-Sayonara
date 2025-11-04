import json
import requests

sample = {
  "data": {
    "blRouteLegs": [
      {
        "actualArrivalDateTZ": "2025-07-23T17:07:00",
        "arrivalDateTz": "2025-08-06T07:00:00",
        "depotNameTo": "INTL TRANS SVC (ITS TERMINAL)",
        "countryNameFrom": "CHINA. PEOPLE'S REPUBLIC",
        "countryNameTo": "U.S.A.",
        "portCodeFrom": "CNOJA",
        "portCodeTo": "USLAX",
        "depotNameFrom": "YANTIAN INTERNATIONAL CONTAINER TERMINAL",
        "portFromType": "POL",
        "portNameFrom": "YANTIAN (GD)",
        "portNameTo": "LOS ANGELES (CA)",
        "portToType": "POD",
        "sailingDateTz": "2025-07-24T00:01:00",
        "vessel": "ZY6",
        "vesselName": "NESTOS",
        "voyage": "9",
        "scheduledArrivalDate": None,
        "scheduledSailingDate": None,
        "partnerVoyage": None,
        "leg": "E",
        "passedCssClass": "passed",
        "isShipWithWave": False,
        "portFromLongitude": "114.27229",
        "portFromLatitude": "22.56851",
        "portToLongitude": "-118.25152",
        "portToLatitude": "33.73119",
        "arrivalDateDt": "2025-08-06T07:00:00"
      }
    ],
    "consignmentDetails": {
      "consContainerList": [
        {
          "unitPrefix": "TGHU",
          "unitNo": "5156966 ",
          "cargoType": "DV40",
          "unitActivityList": [
            {
              "activityDateTz": "2025-08-12T10:13:00",
              "activityDesc": "Import truck departure from Port of Discharge to Customer",
              "countryFromName": "U.S.A.",
              "leg": "W",
              "vessel": "ZY6",
              "vesselName": "NESTOS",
              "voyage": "9",
              "placeFromDesc": "LOS ANGELES (CA)"
            },
            {
              "activityDateTz": "2025-08-07T15:28:00",
              "activityDesc": "Container was discharged at Port of Destination",
              "countryFromName": "U.S.A.",
              "leg": "W",
              "vessel": "ZY6",
              "vesselName": "NESTOS",
              "voyage": "9",
              "placeFromDesc": "LOS ANGELES (CA)"
            }
          ]
        }
      ]
    },
    "finalETA": {
      "etaValue": "2025-08-06T17:00:00",
      "etaValueDate": "2025-08-06T07:00:00.000",
      "etaDescription": None
    },
    "agreedETA": {
      "etaValue": "2025-08-05T14:00:00",
      "etaValueDate": "2025-08-05T04:00:00.000",
      "etaDescription": "POD"
    },
    "showUsTracingStatus": True,
    "consTypeParamForUsTracing": "bl",
    "isConsRejected": False,
    "scheduleByVesselUrl": "/schedules/schedule-by-vessel",
    "myZimDomain": "https://my.zim.com"
  },
  "isPrivateInfo": True,
  "message": None,
  "isServerTimeOut": False,
  "isSuccess": True,
  "tracingNotification": True
}

if __name__ == '__main__':
    url = 'http://localhost:5100/Zim4/v1/map'
    payload = sample
    payload['code'] = 'TGHU5156966'
    payload['codeType'] = 'Container'
    r = requests.post(url, json=payload)
    print('Status:', r.status_code)
    print(r.text)