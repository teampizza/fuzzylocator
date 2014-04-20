library(shiny)
library(maps)
library(mapdata)
library(rworldmap)
library(gridExtra)
source("../mapfuncs.R")

shinyServer(function(input, output) {
  # Reactive dependencies
  buttonClicked <- reactive(input$paintupdate)
  
  isolate({
  theworld <- function() {
    myplot <- map("world2", wrap=TRUE, plot=TRUE,
        resolution=2)
  }})
  
  user.circle <- function() {
    if (buttonClicked() > 0) {
      cur.circ <- circleFun(c(input$plotclick$x,input$plotclick$y),
                            radius=input$radius*100, npoints = 30)
      polygon(x=cur.circ$x,y=cur.circ$y,
              col = rainbow(1000,s=0.5,alpha=0.5)[input$circlecolor])
    }
  }
  
  output$myworld <- renderPlot({
    theworld()
    user.circle()
  })
  
  output$clickcoord <- renderPrint({
    # get user clicks, report coords
    if ("plotclick" %in% names(input)) {
      print(input$plotclick)
    }
    print(buttonClicked())
  })
  


})