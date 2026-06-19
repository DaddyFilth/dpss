'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Type, Palette, Image as ImageIcon, Download, RotateCw } from 'lucide-react';

export interface CustomizationData {
  customText?: string;
  customImage?: string[];
  customColors?: string[];
  material?: string;
  size?: string;
  quality?: string;
  printMethod?: string;
  files?: File[];
}

interface ProductCustomizerProps {
  productId: string;
  customizationConfig?: any;
  onCustomizationChange: (data: CustomizationData) => void;
  initialData?: CustomizationData;
}

export const ProductCustomizer = ({
  productId,
  customizationConfig,
  onCustomizationChange,
  initialData,
}: ProductCustomizerProps) => {
  const [customizationData, setCustomizationData] = useState<CustomizationData>(initialData || {});
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    onCustomizationChange(customizationData);
  }, [customizationData, onCustomizationChange]);

  const handleTextChange = (value: string) => {
    setCustomizationData((prev) => ({ ...prev, customText: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setCustomizationData((prev) => ({ 
        ...prev, 
        files: fileArray,
        customImage: fileArray.map(() => URL.createObjectURL(fileArray[0]))
      }));
    }
  };

  const handleColorChange = (color: string) => {
    setCustomizationData((prev) => ({
      ...prev,
      customColors: [...(prev.customColors || []), color],
    }));
  };

  const removeColor = (color: string) => {
    setCustomizationData((prev) => ({
      ...prev,
      customColors: prev.customColors?.filter((c) => c !== color) || [],
    }));
  };

  const generatePreview = async () => {
    setIsGenerating(true);
    // Simulate preview generation - in real app, this would call an API
    setTimeout(() => {
      setPreviewImage('/api/preview/' + productId);
      setIsGenerating(false);
    }, 1000);
  };

  const resetCustomization = () => {
    setCustomizationData({});
    setPreviewImage('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Customize Your Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="text">
              <Type className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="h-4 w-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="color">
              <Palette className="h-4 w-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="options">
              <RotateCw className="h-4 w-4 mr-2" />
              Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 mt-4">
            {customizationConfig?.text?.enabled && (
              <>
                <div>
                  <Label>Custom Text</Label>
                  <Textarea
                    placeholder="Enter your custom text..."
                    value={customizationData.customText || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    maxLength={customizationConfig.text?.maxChars || 100}
                    className="mt-2"
                  />
                  {customizationConfig.text?.maxChars && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {customizationData.customText?.length || 0} / {customizationConfig.text.maxChars} characters
                    </p>
                  )}
                </div>
                {customizationConfig.text?.required && (
                  <p className="text-xs text-orange-600">* Required</p>
                )}
              </>
            )}
            {!customizationConfig?.text?.enabled && (
              <p className="text-muted-foreground text-sm">Text customization is not available for this product.</p>
            )}
          </TabsContent>

          <TabsContent value="image" className="space-y-4 mt-4">
            {customizationConfig?.image?.enabled && (
              <>
                <div>
                  <Label>Upload Images</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag & drop images here or click to upload
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </div>
                  {customizationConfig.image?.maxFiles && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Max {customizationConfig.image.maxFiles} files
                    </p>
                  )}
                </div>
                
                {customizationData.customImage && customizationData.customImage.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {customizationData.customImage.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Custom ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => {
                            setCustomizationData((prev) => ({
                              ...prev,
                              customImage: prev.customImage?.filter((_, i) => i !== index) || [],
                              files: prev.files?.filter((_, i) => i !== index) || [],
                            }));
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {customizationConfig.image?.required && !customizationData.customImage?.length && (
                  <p className="text-xs text-orange-600">* Required</p>
                )}
              </>
            )}
            {!customizationConfig?.image?.enabled && (
              <p className="text-muted-foreground text-sm">Image customization is not available for this product.</p>
            )}
          </TabsContent>

          <TabsContent value="color" className="space-y-4 mt-4">
            {customizationConfig?.color?.enabled && (
              <>
                <div>
                  <Label>Custom Colors</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      type="color"
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-16 h-10"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {customizationData.customColors?.map((color) => (
                        <div
                          key={color}
                          className="w-10 h-10 rounded-full border-2 border-white shadow cursor-pointer relative"
                          style={{ backgroundColor: color }}
                        >
                          <button
                            onClick={() => removeColor(color)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {customizationConfig.color?.options && (
                  <div>
                    <Label>Preset Colors</Label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {customizationConfig.color.options.map((color: string) => (
                        <div
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-primary"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {!customizationConfig?.color?.enabled && (
              <p className="text-muted-foreground text-sm">Color customization is not available for this product.</p>
            )}
          </TabsContent>

          <TabsContent value="options" className="space-y-4 mt-4">
            <div>
              <Label>Material</Label>
              <select
                value={customizationData.material || ''}
                onChange={(e) => setCustomizationData((prev) => ({ ...prev, material: e.target.value }))}
                className="mt-2 w-full p-2 border rounded"
              >
                <option value="">Select material</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium (+20%)</option>
                <option value="luxury">Luxury (+50%)</option>
              </select>
            </div>

            <div>
              <Label>Size</Label>
              <select
                value={customizationData.size || ''}
                onChange={(e) => setCustomizationData((prev) => ({ ...prev, size: e.target.value }))}
                className="mt-2 w-full p-2 border rounded"
              >
                <option value="">Select size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>

            <div>
              <Label>Quality</Label>
              <select
                value={customizationData.quality || ''}
                onChange={(e) => setCustomizationData((prev) => ({ ...prev, quality: e.target.value }))}
                className="mt-2 w-full p-2 border rounded"
              >
                <option value="">Select quality</option>
                <option value="standard">Standard</option>
                <option value="high">High Quality (+15%)</option>
                <option value="premium">Premium Quality (+30%)</option>
              </select>
            </div>

            <div>
              <Label>Print Method</Label>
              <select
                value={customizationData.printMethod || ''}
                onChange={(e) => setCustomizationData((prev) => ({ ...prev, printMethod: e.target.value }))}
                className="mt-2 w-full p-2 border rounded"
              >
                <option value="">Select print method</option>
                <option value="DTG">Direct to Garment (DTG)</option>
                <option value="screen">Screen Printing</option>
                <option value="embroidery">Embroidery</option>
                <option value="sublimation">Sublimation</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <Button 
            onClick={generatePreview} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Generating Preview...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate Preview
              </>
            )}
          </Button>

          {previewImage && (
            <div className="border rounded-lg p-4">
              <Label className="mb-2 block">Preview</Label>
              <img src={previewImage} alt="Customization preview" className="w-full rounded" />
            </div>
          )}

          <Button 
            onClick={resetCustomization} 
            variant="outline"
            className="w-full"
          >
            Reset Customization
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};