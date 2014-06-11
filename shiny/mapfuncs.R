circleFun <- function(center = c(0,0),radius = 1, npoints = 100){
    tt <- seq(0,2*pi,length.out = npoints)
    xx <- center[1] + radius * cos(tt)
    yy <- center[2] + radius * sin(tt)
    return(data.frame(x = xx, y = yy))
}
