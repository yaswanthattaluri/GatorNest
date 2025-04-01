import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FindRoommate from '../src/pages/FindRoommate.jsx';

// Mock fetch API
global.fetch = jest.fn();

// Create a proper localStorage mock with Jest functions
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

// Replace the global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Sample mock data
const mockStudentProfiles = [
  {
    id: 1,
    name: "John Doe",
    gender: "Male",
    sleep_schedule: "Early Bird",
    cleanliness: "Very Tidy",
    social_preference: "Private Space"
  },
  {
    id: 2,
    name: "Jane Smith",
    gender: "Female",
    sleep_schedule: "Night Owl",
    cleanliness: "Moderately Tidy",
    social_preference: "Social Space"
  }
];

describe('FindRoommate Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API response
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockStudentProfiles
    });
    localStorage.getItem.mockReturnValue(JSON.stringify([]));
  });

  test('renders the component with loading state initially', () => {
    render(<FindRoommate />);
    expect(screen.getByText('Find Roommates')).toBeInTheDocument();
    expect(screen.getByText('Loading profiles...')).toBeInTheDocument();
  });

  test('fetches and displays student profiles', async () => {
    render(<FindRoommate />);
    
    // Wait for profiles to load
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    // Check if profiles are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('filters profiles by gender', async () => {
    render(<FindRoommate />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    // Select "Male" filter
    const genderSelect = screen.getByLabelText('Gender:');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });
    
    // Should show only male profiles
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test('filters profiles by sleep schedule', async () => {
    render(<FindRoommate />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    // Select "Night Owl" filter
    const sleepScheduleSelect = screen.getByLabelText('Sleep Schedule:');
    fireEvent.change(sleepScheduleSelect, { target: { value: 'Night Owl' } });
    
    // Should show only night owl profiles
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('filters profiles by cleanliness', async () => {
    render(<FindRoommate />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    // Select "Very Tidy" filter
    const cleanlinessSelect = screen.getByLabelText('Cleanliness:');
    fireEvent.change(cleanlinessSelect, { target: { value: 'Very Tidy' } });
    
    // Should show only very tidy profiles
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test('filters profiles by social preference', async () => {
    render(<FindRoommate />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    // Select "Social Space" filter
    const socialSelect = screen.getByLabelText('Social Preference:');
    fireEvent.change(socialSelect, { target: { value: 'Social Space' } });
    
    // Should show only social space profiles
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('clears all filters when clear button is clicked', async () => {
    render(<FindRoommate />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    // Apply a filter first
    const genderSelect = screen.getByLabelText('Gender:');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });
    
    // Verify filter is applied
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    
    // Clear filters
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);
    
    // Both profiles should be visible again
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('shows "no results" message when filters match no profiles', async () => {
    render(<FindRoommate />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    // Apply impossible filter combination
    const genderSelect = screen.getByLabelText('Gender:');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });
    
    const sleepScheduleSelect = screen.getByLabelText('Sleep Schedule:');
    fireEvent.change(sleepScheduleSelect, { target: { value: 'Night Owl' } });
    
    // Should show no results message
    expect(screen.getByText('No profiles match your filter criteria')).toBeInTheDocument();
  });

  test('toggles favorite status when favorite button is clicked', async () => {
    render(<FindRoommate />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    // Find and click the favorite button for the first profile
    const favoriteButtons = screen.getAllByLabelText('Add to favorites');
    fireEvent.click(favoriteButtons[0]);
    
    // Verify favorites section appears
    expect(screen.getByText('Your Favorites')).toBeInTheDocument();
    
    // Verify localStorage was called to save favorites
    expect(localStorage.setItem).toHaveBeenCalledWith('favoriteRoommates', JSON.stringify([1]));
    
    // Click again to unfavorite
    const removeFavoriteButton = screen.getAllByLabelText('Remove from favorites')[0];
    fireEvent.click(removeFavoriteButton);
    
    // Favorites section should be gone
    expect(screen.queryByText('Your Favorites')).not.toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    // Mock failed API response
    fetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(<FindRoommate />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading profiles...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Failed to fetch student profiles')).toBeInTheDocument();
  });
});