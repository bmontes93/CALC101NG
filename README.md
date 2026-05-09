# Calc101: Next Gen Mathematical Interface

[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8+-646CFF.svg)](https://vitejs.dev/)
[![MathLive](https://img.shields.io/badge/MathLive-ready-ED407A.svg)](https://cortexjs.io/mathlive/)

**Calc101** es la interfaz de usuario de última generación para el motor simbólico Calc101. Esta aplicación web ofrece una experiencia de usuario premium para la resolución de problemas matemáticos complejos, desde cálculo integral hasta sistemas de ecuaciones no lineales.

## ✨ Características Principales

- **Editor Matemático WYSIWYG**: Integración con MathLive para una escritura natural de fórmulas mediante teclado virtual.
- **Gráficas Interactivas 2D**: Visualización automática de funciones, raíces y regiones de solución para inecuaciones.
- **Desglose de Pasos**: Interfaz limpia para visualizar el procedimiento lógico de cada operación.
- **Diseño Glassmorphism**: Estética moderna, responsiva y optimizada para el rendimiento.
- **Soporte Multitarea**: Pestañas dedicadas para Cálculo, Álgebra y Álgebra Lineal (Matrices).

## 🚀 Tecnologías

- **React 19** con TypeScript.
- **Framer Motion** para micro-interacciones y animaciones premium.
- **Function-Plot (D3)** para el renderizado dinámico de gráficas.
- **KaTeX** para la tipografía matemática de alta calidad.

## 🛠️ Configuración Local

Este repositorio contiene únicamente la aplicación frontend. Para funcionar, requiere conexión con el motor de cálculo Calc101 (API Privada).

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/bmontes93/CALC101NG.git
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar entorno de desarrollo:
   ```bash
   npm run dev
   ```

## 🔒 Arquitectura Segura

La lógica de cálculo simbólico y procesamiento algebraico se procesa de forma remota a través de una API REST privada de alto rendimiento, asegurando la integridad y la propiedad intelectual del motor matemático.

---
**Desarrollado por [Bryan Montes](https://github.com/bmontes93)**
