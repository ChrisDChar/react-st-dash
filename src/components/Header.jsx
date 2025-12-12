import ToggleTheme from './ToggleTheme';

export default function Header({ isDark, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          School Management System
        </h1>
        <ToggleTheme isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}