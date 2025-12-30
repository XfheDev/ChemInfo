export interface Theme {
  id: string;
  name: string;
  icon: string;
  colors: {
    primary400: string;
    primary500: string;
    primary600: string;
    surface900: string;
    surface800: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'cyan',
    name: 'Turkuaz (Standart)',
    icon: 'science',
    colors: {
      primary400: '34 211 238',
      primary500: '6 182 212',
      primary600: '8 145 178',
      surface900: '8 14 24',
      surface800: '14 25 40',
    }
  },
  {
    id: 'nebula',
    name: 'Nebula (Derin Mor)',
    icon: 'auto_awesome',
    colors: {
      primary400: '192 132 252',
      primary500: '168 85 247',
      primary600: '147 51 234',
      surface900: '12 8 20',
      surface800: '22 14 36',
    }
  },
  {
    id: 'emerald',
    name: 'Zümrüt (Biyo-Kimya)',
    icon: 'eco',
    colors: {
      primary400: '52 211 153',
      primary500: '16 185 129',
      primary600: '5 150 105',
      surface900: '4 16 12',
      surface800: '8 32 24',
    }
  },
  {
    id: 'magma',
    name: 'Magma (Reaksiyon)',
    icon: 'local_fire_department',
    colors: {
      primary400: '251 146 60',
      primary500: '249 115 22',
      primary600: '234 88 12',
      surface900: '20 8 4',
      surface800: '36 14 8',
    }
  },
  {
    id: 'sapphire',
    name: 'Safir (Kristal)',
    icon: 'biotech',
    colors: {
      primary400: '96 165 250',
      primary500: '59 130 246',
      primary600: '37 99 235',
      surface900: '6 12 28',
      surface800: '10 20 48',
    }
  },
  {
    id: 'amber',
    name: 'Kehribar (Antik)',
    icon: 'history_edu',
    colors: {
      primary400: '251 191 36',
      primary500: '245 158 11',
      primary600: '217 119 6',
      surface900: '16 12 4',
      surface800: '28 22 8',
    }
  },
  {
    id: 'rose',
    name: 'Kuvars (Kuantum)',
    icon: 'auto_fix_high',
    colors: {
      primary400: '251 113 133',
      primary500: '244 63 94',
      primary600: '225 29 72',
      surface900: '20 4 8',
      surface800: '36 8 16',
    }
  },
  {
    id: 'cyber',
    name: 'Cyber (Endüstriyel)',
    icon: 'memory',
    colors: {
      primary400: '45 212 191',
      primary500: '20 184 166',
      primary600: '13 148 136',
      surface900: '8 8 12',
      surface800: '16 16 24',
    }
  }
];