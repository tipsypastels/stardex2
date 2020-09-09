import VANILLA_TYPES from '../data/types.json';
import randomColor from 'randomcolor';

type VanillaType = keyof typeof VANILLA_TYPES;
type VanillaTypeProp = keyof typeof VANILLA_TYPES[VanillaType];

export const typeColor = (type: string) => 
  pluckTypeValue(type, 'color', 
  () => randomColor({ seed: type, format: 'rgb' }));

export const typeIcon = (type: string) =>
  pluckTypeValue(type, 'icon', () => 'question-circle');

export function pluckTypeValue(
  type: string,
  key: VanillaTypeProp,
  getFallback: () => string,
) {
  type = type.toLowerCase();
  return typeIsVanilla(type) 
    ? VANILLA_TYPES[type][key]
    : getFallback();
}

export function typeIsVanilla(type: string): type is VanillaType {
  return type in VANILLA_TYPES;
}