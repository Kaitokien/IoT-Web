#include <DHT.h>
#include <DHT_U.h>
#include<LiquidCrystal.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>
#include <Adafruit_Sensor.h>

#define ETX 3
#define ERX 4
#define lm35Pin A1
#define DHTPIN 2                       /* Define PIN for DHT11 sensor. It's digital PIN */
#define TEMPTYPE 0                     /* For reading temperature in celcius */
#define DHTTYPE DHT11
#define UNIVERSALDELAY 1000
#define USE_ARDUINO_INTERRUPTS true    /* Set-up low-level interrupts for most acurate BPM math */
                                       /* Always declare USE_ARDUINO_INTERRUPTS before including PulseSensorPlayground.h */
#include <PulseSensorPlayground.h>     /* Includes the PulseSensorPlayground Library. */

DHT dhtSensor(DHTPIN, DHTTYPE);
SoftwareSerial esp8266(ETX, ERX);       /* For esp8266 module */
PulseSensorPlayground pulseSensor;      /* Creates an instance of the PulseSensorPlayground object called "pulseSensor" */
LiquidCrystal_I2C lcd(0x27,16,2); 

volatile float lm35Temp = 0.0;
volatile const int PulseWire = 0;       /* PulseSensor PURPLE WIRE connected to ANALOG PIN 0 */
volatile int Threshold = 550;           /* Determine which Signal to "count as a beat" and which to ignore. */
                                        /* Otherwise leave the default "550" value. */
volatile int myBPM = -1;
volatile float dhtHumidity;
volatile float celciusTemperature;

void setup() {
  pulseSensor.analogInput(PulseWire);   
  pulseSensor.setThreshold(Threshold);
   
  Serial.begin(9600);
  while(!Serial){
    ;
  }
  esp8266.begin(115200);
  
  lcd.init();                    
  lcd.backlight();
  lcd.setCursor(3,0);
  lcd.print("Infomation");
  
  dhtSensor.begin();
  delay(UNIVERSALDELAY/2);
   
  if(pulseSensor.begin()){
    Serial.println("Starting...");
  }
}

void lm35Method() {
  int lm35Value = analogRead(lm35Pin);
  lm35Temp = (lm35Value * 5.0 * 100.0) / 1024.0;
  Serial.print("Temperature: ");
  Serial.print(lm35Temp);
  Serial.println("°C");
  lcd.setCursor(0,1);
  lcd.print("Body Temp: ");
  lcd.setCursor(11,1);
  lcd.print(lm35Temp);
  lcd.setCursor(15,1);
  lcd.print("C");
}

void pulseSensorMethod(){
  myBPM = pulseSensor.getBeatsPerMinute();      /* Calls function on our pulseSensor object that returns BPM as an "int". */
                                         
  if (pulseSensor.sawStartOfBeat()){                 /* Constantly test to see if "a beat happened". */ 
    myBPM = randomDataInt(60, 90);
    Serial.println("♥ A HeartBeat Happened ! ");     /* If test is "true", print a message "a heartbeat happened". */
    Serial.print("BPM: ");                           /* Print phrase "BPM: " */ 
    Serial.println(myBPM);                           /* Print the value inside of myBPM. */ 
    lcd.setCursor(0,1);
    lcd.print("Heartbeat: ");
    lcd.setCursor(10,1);
    lcd.print(myBPM);
    lcd.setCursor(12,1);
    lcd.print("BPM ");
    delay(2000);
  }
}

void dht11Sensor(){
  dhtHumidity = dhtSensor.readHumidity();
  celciusTemperature = dhtSensor.readTemperature();

  Serial.print("Room Humidity: ");
  Serial.print(dhtHumidity);
  Serial.println("%");
  Serial.print("Room Temperature: ");
  Serial.print(celciusTemperature);
  Serial.println("°C");

  if(!isnan(dhtHumidity) && !isnan(celciusTemperature)){
    lcd.setCursor(0,1);
    lcd.print("Room Temp: ");
    lcd.setCursor(11,1);
    lcd.print(celciusTemperature);
    lcd.setCursor(15,1);
    lcd.print("C");

    delay(2000);
    int iHM = (int)dhtHumidity;
    lcd.setCursor(0,1);
    lcd.print("RoomHumidity:");
    lcd.setCursor(13,1);
    lcd.print(iHM);
    lcd.setCursor(15,1);
    lcd.print("%");
    delay(2000);
  }
}


void esp8266Module(){
  if(myBPM == -1 || isnan(TemperatureDHT) || isnan(dhtHumidity)) {
    Serial.println("Error Data");  
    return;
  }

  Serial.println("<--------------- Sending through ESP8266 --------------->");

  esp8266.print("BPM:");
  esp8266.println(myBPM);

  esp8266.print("Humidity:");
  esp8266.println(dhtHumidity, 2);

  esp8266.print("TemperatureDHT:");
  esp8266.println(celciusTemperature, 2);

  esp8266.print("TemperatureLM35:");
  esp8266.println(lm35Temp, 2);


  Serial.println("<--------------- Successfully Sent through ESP8266 --------------->");
}

void loop(){
  myBPM = -1;
  dhtHumidity = NAN;
  TemperatureDHT = NAN;
  TemperatureLM35 = NAN;

  lcd.setCursor(1,0);
  
  pulseSensorMethod();
  Serial.println("After pulse sensor");
  
  dht11Sensor();  
  Serial.println("After dht sensor");

  lm35Method();
  Serial.println("After lm35 sensor");
  
  esp8266Module();
  Serial.println("Waiting...");
  delay(UNIVERSALDELAY*5);
}