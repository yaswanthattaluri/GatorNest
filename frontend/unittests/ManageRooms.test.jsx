import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  PlusCircle: () => <div data-testid="plus-circle-icon">Plus Icon</div>,
  Trash2: () => <div data-testid="trash2-icon">Trash Icon</div>
}));

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

// Mock CSS import
jest.mock('../styles/ManageRooms.css', () => ({}));

// Import after mocking
import ManageRooms from '../src/pages/ManageRooms';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: mockGetItem,
      setItem: mockSetItem,
    },
    writable: true
  });

// Mock fetch globally
global.fetch = jest.fn();
global.alert = jest.fn();
global.localStorage = {
  getItem: jest.fn().mockReturnValue('mock-token')
};

describe('ManageRooms Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    alert.mockClear();
    mockGetItem.mockClear();
  });

  test('renders add room form by default', () => {
    render(<ManageRooms />);
    
    expect(screen.getByText('Enter Room Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Room Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Room Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Vacancies')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Add Room$/i })).toBeInTheDocument();
  });

  test('switches between add and delete room forms', () => {
    render(<ManageRooms />);
    
    expect(screen.getByText('Enter Room Details')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('trash2-icon').closest('button'));
    
    expect(screen.getByRole('heading', { name: /^Delete Room$/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Room Number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Delete Room$/i }).closest('.submit-btn')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('plus-circle-icon').closest('button'));
    
    expect(screen.getByText('Enter Room Details')).toBeInTheDocument();
  });

  test('updates room details state when inputs change', () => {
    render(<ManageRooms />);
    
    const typeInput = screen.getByLabelText('Room Type');
    const numberInput = screen.getByLabelText('Room Number');
    const priceInput = screen.getByLabelText('Price');
    const vacanciesInput = screen.getByLabelText('Vacancies');
    
    fireEvent.input(typeInput, { target: { value: 'Deluxe' } });
    fireEvent.input(numberInput, { target: { value: '101' } });
    fireEvent.input(priceInput, { target: { value: '1200' } });
    fireEvent.input(vacanciesInput, { target: { value: '2' } });
    
    expect(typeInput).toHaveValue('Deluxe');
    expect(numberInput).toHaveValue('101');
    expect(priceInput).toHaveValue('1200');
    expect(vacanciesInput).toHaveValue('2');
  });

  test('shows alert when attempting to delete without room number', async () => {
    render(<ManageRooms />);
    
    fireEvent.click(screen.getByTestId('trash2-icon').closest('button'));
    
    fireEvent.click(screen.getByRole('button', { name: /^Delete Room$/i }));
    
    expect(alert).toHaveBeenCalledWith('Please enter a valid room number');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('handles network error when deleting a room', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<ManageRooms />);
    
    fireEvent.click(screen.getByTestId('trash2-icon').closest('button'));
    
    fireEvent.input(screen.getByLabelText('Room Number'), { target: { value: '404' } });
    
    fireEvent.click(screen.getByRole('button', { name: /^Delete Room$/i }));
    
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Error deleting room. Please try again.');
    });
  });

  test('calls API with correct data when adding a room', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Room added successfully!' })
    });
    
    render(<ManageRooms />);
    
    fireEvent.input(screen.getByLabelText('Room Type'), { target: { value: 'Deluxe' } });
    fireEvent.input(screen.getByLabelText('Room Number'), { target: { value: '101' } });
    fireEvent.input(screen.getByLabelText('Price'), { target: { value: '1200' } });
    fireEvent.input(screen.getByLabelText('Vacancies'), { target: { value: '2' } });
    
    fireEvent.click(screen.getByRole('button', { name: /^Add Room$/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/rooms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: JSON.stringify({
          name: '',
          type: 'Deluxe',
          room_number: 101,
          price: 1200,
          vacancy: 2
        })
      });
      
      expect(alert).toHaveBeenCalledWith('Room added successfully!');
    });
  });
  test('shows alert when attempting to delete with empty room number', async () => {
    render(<ManageRooms />);
    
    // Switch to delete form
    fireEvent.click(screen.getByTestId('trash2-icon').closest('button'));
    
    // Attempt delete with empty input
    fireEvent.click(screen.getByRole('button', { name: /^Delete Room$/i }));
    
    expect(alert).toHaveBeenCalledWith('Please enter a valid room number');
    expect(fetch).not.toHaveBeenCalled();
  }); 
});
