import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  PanResponder,
  StyleSheet
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
// Using raw Three.js with Expo GL - procedural geometry for maximum Hermes compatibility

interface Interactive3DGlassProps {
  size?: number;
}

export default function Interactive3DGlass({
  size = 200
}: Interactive3DGlassProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const glassModelRef = useRef<THREE.Object3D | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Touch interaction state
  const rotationX = useRef(0);
  const rotationY = useRef(0);
  const targetRotationX = useRef(0);
  const targetRotationY = useRef(0);

  // Pan responder for touch interactions
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onPanResponderMove: (_, gestureState) => {
      targetRotationY.current = gestureState.dx * 0.01;
      targetRotationX.current = -gestureState.dy * 0.01;
    },
    onPanResponderRelease: () => {
      targetRotationX.current = 0;
      targetRotationY.current = 0;
    },
  });

  const onContextCreate = async (gl: any) => {
    try {
      console.log('🔧 Initializing 3D scene with Hermes-compatible WebGL...');

      // Check GL extensions and capabilities before initialization
      const extensions = {
        anisotropic: gl.getExtension('EXT_texture_filter_anisotropic'),
        derivatives: gl.getExtension('OES_standard_derivatives'),
        vertexArrayObject: gl.getExtension('OES_vertex_array_object'),
        multisampling: gl.getExtension('WEBGL_multisampled_rendertarget')
      };

      console.log('📊 GL Extensions available:', {
        anisotropic: !!extensions.anisotropic,
        derivatives: !!extensions.derivatives,
        vertexArrayObject: !!extensions.vertexArrayObject,
        multisampling: !!extensions.multisampling
      });

      // Initialize renderer with Hermes-safe settings
      const renderer = new THREE.WebGLRenderer({
        canvas: {
          width: size,
          height: size,
          style: {},
          addEventListener: () => { },
          removeEventListener: () => { },
          clientHeight: size,
          clientWidth: size,
          getContext: () => gl,
        } as any,
        context: gl,
        antialias: false, // Disable antialiasing to avoid renderbufferStorageMultisample
        alpha: true,
        premultipliedAlpha: true,
        stencil: false,
        preserveDrawingBuffer: true,
        powerPreference: 'default'
      });

      renderer.setSize(size, size, false);
      renderer.setClearColor(0x000000, 0);

      // Disable problematic features that might trigger unsupported GL calls
      renderer.shadowMap.enabled = false;

      // Log fallback usage
      if (!extensions.multisampling) {
        console.log('⚠️ Multisampling not available - using basic rendering (expected on Hermes)');
      }

      rendererRef.current = renderer;

      // Initialize scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Initialize camera
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0, 0, 4);
      cameraRef.current = camera;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(2, 2, 5);
      scene.add(directionalLight);

      // Create beautiful procedural glass geometry - 100% Hermes compatible
      console.log('🎨 Creating procedural glass geometry...');

      const glassGroup = new THREE.Group();

      // Main glass bowl - elegant wine glass shape
      const glassGeometry = new THREE.SphereGeometry(1.0, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const glassMaterial = new THREE.MeshLambertMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const glassBody = new THREE.Mesh(glassGeometry, glassMaterial);
      glassBody.position.y = 0.2;
      glassGroup.add(glassBody);

      // Glass stem - elegant and thin
      const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1.2, 16);
      const stemMaterial = new THREE.MeshLambertMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.8,
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = -0.8;
      glassGroup.add(stem);

      // Glass base - stable foundation
      const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 24);
      const baseMaterial = new THREE.MeshLambertMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.9,
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -1.4;
      glassGroup.add(base);

      // Rim highlight for elegance
      const rimGeometry = new THREE.TorusGeometry(1.0, 0.02, 8, 32);
      const rimMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.position.y = 0.8;
      glassGroup.add(rim);

      // Add subtle inner reflection
      const innerGeometry = new THREE.SphereGeometry(0.95, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const innerMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      });
      const innerReflection = new THREE.Mesh(innerGeometry, innerMaterial);
      innerReflection.position.y = 0.2;
      glassGroup.add(innerReflection);

      scene.add(glassGroup);
      glassModelRef.current = glassGroup;
      setIsLoaded(true);
      console.log('✅ Beautiful procedural glass created - 100% Hermes compatible');

      // Start render loop with error handling
      const render = () => {
        try {
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            // Smooth interpolation for touch interactions
            rotationX.current += (targetRotationX.current - rotationX.current) * 0.1;
            rotationY.current += (targetRotationY.current - rotationY.current) * 0.1;

            // Apply rotations to the model if it exists
            if (glassModelRef.current) {
              glassModelRef.current.rotation.x = rotationX.current;
              glassModelRef.current.rotation.y += 0.005 + rotationY.current * 0.1;
              glassModelRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
            }

            // Damping
            targetRotationX.current *= 0.95;
            targetRotationY.current *= 0.95;

            // Safe render call with error handling
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
        } catch (renderError) {
          console.error('🚨 Render loop error (non-fatal):', renderError);
          // Continue animation loop even if individual frame fails
        }

        animationFrameRef.current = requestAnimationFrame(render);
      };

      render();
      console.log('🎬 Render loop started successfully');

    } catch (error) {
      console.error('🚨 CRITICAL: Error initializing 3D scene:', error);
      console.log('🔄 Fallback: Setting loaded state to prevent infinite loading');
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Cleanup Three.js resources to prevent memory leaks
      try {
        if (glassModelRef.current) {
          glassModelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(material => material.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        }

        if (rendererRef.current) {
          rendererRef.current.dispose();
        }

        console.log('🧹 3D resources cleaned up successfully');
      } catch (cleanupError) {
        console.error('⚠️ Error during cleanup (non-critical):', cleanupError);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View
        {...panResponder.panHandlers}
        style={[styles.glassContainer, { width: size, height: size }]}
      >
        <GLView
          style={[styles.glView, { width: size, height: size }]}
          onContextCreate={onContextCreate}
        />
        {!isLoaded && (
          <View style={[styles.loadingOverlay, { width: size, height: size }]}>
            <View style={styles.loadingDot} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  glView: {
    borderRadius: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4488ff',
    opacity: 0.6,
  },
});