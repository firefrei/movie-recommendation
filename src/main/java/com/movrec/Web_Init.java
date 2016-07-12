package com.movrec;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class Web_Init implements ServletContextListener
{	
	Rec recModel;
	
	public void contextInitialized(ServletContextEvent sce) {
		
		ServletContext sc = sce.getServletContext();
		recModel = new Rec();
		sc.setAttribute("recModel", recModel);
		
		System.out.println("context initialized");
	}
	
	
	public void contextDestroyed(ServletContextEvent sce) {		
		recModel.close();
		System.out.println("context destroyed");
	}

}