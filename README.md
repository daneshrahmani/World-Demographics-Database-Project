# World Demographics Database Project

A full-stack web application for exploring and analyzing world demographics data using Oracle Database, Express.js, and vanilla JavaScript.

## Overview

This project demonstrates comprehensive database management and web development skills through the creation of a demographics analysis system. The application allows users to query and visualize demographic data from countries around the world through an intuitive web interface.

## Key Features

Country Data, GDP Analytics, City Demographics, Currency Information, Language Demographics

## Technology Stack

### Backend
- **Database**: Oracle Database
- **Server**: Express.js (Node.js)
- **Query Engine**: Custom SQL queries for demographic analysis

### Frontend  
- **HTML5**: Semantic markup and structure
- **CSS3**: Responsive design and styling
- **JavaScript**: Interactive functionality and API communication

## Architecture

This project follows the **MVC (Model-View-Controller)** pattern:

### Controllers Layer
- **GDPController**: Handles GDP-related API endpoints and request processing
- **cityController**: Manages city demographics queries and responses  
- **countryController**: Processes country-level demographic requests
- **currencyController**: Handles currency information and conversions
- **languageController**: Manages language distribution data
- **appController**: Main application routing and coordination

### Services Layer  
- **GDPService**: Business logic for GDP calculations and analysis
- **cityService**: City data processing and statistical operations
- **countryService**: Country demographics computation and filtering
- **currencyService**: Currency data management and operations
- **databaseService**: Oracle database connections, query execution, and data mapping
- **languageService**: Language demographics processing
- **appService**: Core application business logic and coordination

### Benefits of This Architecture
- **Separation of Concerns**: Clear distinction between data access, business logic, and request handling
- **Maintainability**: Makes code easy to update and debug
- **Scalability**: Easy to scale for new demographic categories or data sources
- **Testability**: Allows for independent testing of individual components

## Key SQL Operations

- **Data Insertion**: Comprehensive INSERT statements to populate demographic tables
- **Complex Queries**: JOIN and Division operations across multiple tables for detailed analysis
- **Aggregate Functions**: Statistical calculations for population trends
- **Filtering & Sorting**: Dynamic data retrieval based on user parameters


## Sample Queries

The application includes various analytical queries such as:
- Countries with highest population density
- Age distribution analysis by region
- Economic indicators correlation with demographics
- Population growth trends over time

## Skills Demonstrated

- **Database Design**: Creating normalized Oracle database schemas with multiple related tables
- **MVC Architecture**: Implementing clean separation between Controllers, Services, and data layers  
- **SQL Proficiency**: Complex queries, joins, and aggregate functions across demographic datasets
- **Backend Development**: RESTful API design with Express.js and modular service architecture
- **Code Organization**: Professional project structure with clear separation of concerns
- **Business Logic**: Implementing complex demographic calculations and data processing
- **Database Integration**: Efficient Oracle database connection management and query optimization

## Future Enhancements

- Real-time data updates from external APIs
- Data visualization charts and graphs
- Advanced filtering and search capabilities
- User authentication and saved queries
