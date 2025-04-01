import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchStudent from '../src/pages/SearchStudent.jsx';

// Mock axios
jest.mock('axios');

// Mock CSS import
jest.mock('../styles/SearchStudent.css', () => ({}));

// Import axios after mocking
import axios from 'axios';


describe('SearchStudent Component', () => {
  const mockStudents = [
    {
      id: 'UF12345',
      name: 'John Doe',
      room_id: '101',
      dorm_preference: 'Gator Hall',
      phone: '123-456-7890',
      age: 20,
      gender: 'Male',
      food_preference: 'Vegetarian',
      preference: 'Night Owl',
      cleanliness: 'Very Tidy',
      people_over: 'Occasional Visitors'
    },
    {
      id: 'UF67890',
      name: 'Jane Smith',
      room_id: '202',
      dorm_preference: 'Swamp Hall',
      phone: '098-765-4321',
      age: 19,
      gender: 'Female',
      food_preference: 'None',
      preference: 'Early Bird',
      cleanliness: 'Moderately Tidy',
      people_over: 'Private Space'
    }
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the search form correctly', () => {
    render(<SearchStudent />);
    
    // Check for main elements
    expect(screen.getByText('Search Student Details')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('changes search type when dropdown value changes', () => {
    render(<SearchStudent />);
    
    const dropdown = screen.getByRole('combobox');
    
    // Default should be 'name'
    expect(dropdown.value).toBe('name');
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    
    // Change to 'id'
    fireEvent.change(dropdown, { target: { value: 'id' } });
    expect(dropdown.value).toBe('id');
    expect(screen.getByPlaceholderText('Enter id')).toBeInTheDocument();
    
    // Change to 'roomNumber'
    fireEvent.change(dropdown, { target: { value: 'roomNumber' } });
    expect(dropdown.value).toBe('roomNumber');
    expect(screen.getByPlaceholderText('Enter roomNumber')).toBeInTheDocument();
  });

  test('updates search term when input changes', () => {
    render(<SearchStudent />);
    
    const input = screen.getByPlaceholderText('Enter name');
    
    fireEvent.change(input, { target: { value: 'John' } });
    expect(input.value).toBe('John');
  });

  test('displays loading state when search is in progress', async () => {
    // Mock axios to delay the response
    axios.get.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => {
      resolve({ data: mockStudents });
    }, 100)));
    
    render(<SearchStudent />);
    
    // Enter search term
    const input = screen.getByPlaceholderText('Enter name');
    fireEvent.change(input, { target: { value: 'John' } });
    
    // Click search button
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    // Check if loading state is displayed
    expect(screen.getByRole('button', { name: 'Searching...' })).toBeInTheDocument();
    expect(searchButton).toBeDisabled();
    
    // Wait for the search to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      expect(searchButton).not.toBeDisabled();
    });
  });

  test('displays search results when API returns data', async () => {
    // Mock successful API response
    axios.get.mockResolvedValueOnce({ data: mockStudents });
    
    render(<SearchStudent />);
    
    // Enter search term
    const input = screen.getByPlaceholderText('Enter name');
    fireEvent.change(input, { target: { value: 'John' } });
    
    // Click search button
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    // Wait for results to be displayed
    await waitFor(() => {
      // Check table headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Student ID')).toBeInTheDocument();
      expect(screen.getByText('Room Number')).toBeInTheDocument();
      
      // Check if student data is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('UF12345')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('UF67890')).toBeInTheDocument();
    });
    
    // Verify API was called with correct parameters
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/students/search', {
      params: { type: 'name', term: 'John' }
    });
  });

  test('displays error message when no students are found', async () => {
    // Mock API response with empty array
    axios.get.mockResolvedValueOnce({ data: [] });
    
    render(<SearchStudent />);
    
    // Enter search term
    const input = screen.getByPlaceholderText('Enter name');
    fireEvent.change(input, { target: { value: 'NonExistent' } });
    
    // Click search button
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    
    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('No students found.')).toBeInTheDocument();
    });
    
    // Check that results table is not displayed
    expect(screen.queryByText('Student ID')).not.toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    // Mock API error
    const errorMsg = 'Server error occurred';
    axios.get.mockRejectedValueOnce({ 
      response: { data: { message: errorMsg } } 
    });
    
    render(<SearchStudent />);
    
    // Enter search term
    const input = screen.getByPlaceholderText('Enter name');
    fireEvent.change(input, { target: { value: 'John' } });
    
    // Click search button
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    
    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  test('displays generic error message when API response lacks message', async () => {
    // Mock API error without specific message
    axios.get.mockRejectedValueOnce({});
    
    render(<SearchStudent />);
    
    // Enter search term and search
    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'John' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    
    // Wait for generic error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch student data.')).toBeInTheDocument();
    });
  });

  test('clears previous error when new search is initiated', async () => {
    // First search fails
    axios.get.mockRejectedValueOnce({ 
      response: { data: { message: 'Error occurred' } } 
    });
    
    render(<SearchStudent />);
    
    // First search
    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'Error' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });
    
    // Mock successful second search
    axios.get.mockResolvedValueOnce({ data: mockStudents });
    
    // Second search
    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'John' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    
    // Error should be cleared immediately when search starts
    expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
  });

  test('searches with different search types', async () => {
    // Mock successful API response
    axios.get.mockResolvedValue({ data: mockStudents });
    
    render(<SearchStudent />);
    
    // Search by name
    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'John' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/students/search', {
        params: { type: 'name', term: 'John' }
      });
    });
    
    // Change to search by ID
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'id' } });
    fireEvent.change(screen.getByPlaceholderText('Enter id'), { target: { value: 'UF12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/students/search', {
        params: { type: 'id', term: 'UF12345' }
      });
    });
    
    // Change to search by room number
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'roomNumber' } });
    fireEvent.change(screen.getByPlaceholderText('Enter roomNumber'), { target: { value: '101' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/students/search', {
        params: { type: 'roomNumber', term: '101' }
      });
    });
  });
});