import React from 'react';

export const PasswordStrengthBar = ({ password = '' }) => {
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-200' };

    let score = 0;
    
    // Check 1: Length >= 6
    if (pwd.length >= 6) score++;
    
    // Check 2: Length >= 8
    if (pwd.length >= 8) score++;
    
    // Check 3: Contains number
    if (/\d/.test(pwd)) score++;
    
    // Check 4: Contains uppercase letter
    if (/[A-Z]/.test(pwd)) score++;

    const mappings = {
      0: { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      1: { score: 1, label: 'Weak', color: 'bg-red-500' },
      2: { score: 2, label: 'Fair', color: 'bg-orange-500' },
      3: { score: 3, label: 'Good', color: 'bg-yellow-500' },
      4: { score: 4, label: 'Strong', color: 'bg-primary' } // Primary is #27AE60
    };

    return mappings[score] || mappings[0];
  };

  const strength = getStrength(password);

  return (
    <div className="space-y-2 mt-1.5">
      {/* 4 segments */}
      <div className="flex gap-1.5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        {[1, 2, 3, 4].map((index) => {
          const isActive = index <= strength.score;
          return (
            <div
              key={index}
              className={`flex-1 h-full transition-all duration-300 ${
                isActive ? strength.color : 'bg-gray-250'
              }`}
            ></div>
          );
        })}
      </div>
      
      {/* Text label */}
      {password && (
        <div className="flex justify-between items-center text-[10px] font-heading font-extrabold uppercase tracking-wider text-textMuted">
          <span>Password Strength</span>
          <span className={`font-extrabold ${
            strength.score <= 1 ? 'text-red-500' :
            strength.score === 2 ? 'text-orange-500' :
            strength.score === 3 ? 'text-yellow-600' : 'text-primary'
          }`}>
            {strength.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthBar;
