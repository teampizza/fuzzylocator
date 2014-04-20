library(shiny)

# Define UI for application
shinyUI(pageWithSidebar(
  
  # Application title
  headerPanel("App"),
  
  sidebarPanel(
    sliderInput("radius", 
                "Location radius", 
                min = 0,
                max = 1, 
                value = 0.1,
                round=FALSE,
                step=0.001),
    sliderInput("circlecolor",
                "Circle color (hue)",
                min=0,
                max=1000,
                step=1,
                value=sample(1:1000,1)),
    actionButton("paintupdate", "Paint Circle"),
    textOutput("clickcoord")
  ),
  
  mainPanel(
    tabsetPanel(
      tabPanel("Map",
               plotOutput("myworld", height="650px",width="750px",
                          clickId="plotclick")
      )
    )
  )
))
